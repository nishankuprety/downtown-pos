import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

const SEATING_OPTIONS = {
  'Counter Seats': ['Counter Seat 1', 'Counter Seat 2'],
  'Tables': ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'],
  'Cabins': ['Cabin 1', 'Cabin 2', 'Cabin 3', 'Cabin 4', 'Cabin 5']
};

function POSPage() {
  const [selectedTable, setSelectedTable] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [taxRate, setTaxRate] = useState(0); // 0% GST (Default)
  const [discount, setDiscount] = useState(0);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (selectedTable) {
      loadCart();
    }
  }, [selectedTable]);

  useEffect(() => {
    if (selectedTable && cart.length >= 0) {
      saveCart();
    }
  }, [cart]);

  const fetchMenuItems = async () => {
    try {
      const response = await fetch(`${API_URL}/menu`);
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const loadCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart/${encodeURIComponent(selectedTable)}`);
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCart([]);
    }
  };

  const saveCart = async () => {
    if (!selectedTable) return;
    try {
      await fetch(`${API_URL}/cart/${encodeURIComponent(selectedTable)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart })
      });
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  };

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, change) => {
    setCart(cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };

  const addCustomItem = () => {
    if (!customItemName || !customItemPrice) {
      alert('Please enter both item name and price');
      return;
    }
    
    const customItem = {
      id: `custom-${Date.now()}`,
      name: customItemName,
      category: 'Custom',
      price: parseFloat(customItemPrice),
      quantity: 1
    };
    
    setCart([...cart, customItem]);
    setCustomItemName('');
    setCustomItemPrice('');
  };

  const calculateTotals = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * (taxRate / 100);
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal + tax - discountAmount;
    return { subtotal, tax, discountAmount, total };
  };

  const generateBill = async () => {
    if (!selectedTable || cart.length === 0) {
      alert('Please select a table and add items to the cart');
      return;
    }

    try {
      const { subtotal, tax, discountAmount, total } = calculateTotals();
      
      // Get next order number
      const orderNumResponse = await fetch(`${API_URL}/orders/next-number`);
      const { order_number } = await orderNumResponse.json();
      
      const orderData = {
        order_number,
        table_name: selectedTable,
        items: cart,
        subtotal,
        tax,
        discount: discountAmount,
        total
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();
      
      setReceiptData({
        ...orderData,
        order_number: result.order_number,
        created_at: new Date().toISOString()
      });
      
      setShowReceipt(true);
      setCart([]);
      setDiscount(0);
    } catch (error) {
      console.error('Error generating bill:', error);
      alert('Error generating bill. Please try again.');
    }
  };

  const printReceipt = () => {
    window.print();
  };

  const closeReceipt = () => {
    setShowReceipt(false);
    setReceiptData(null);
    setSelectedTable('');
  };

  const { subtotal, tax, discountAmount, total } = calculateTotals();

  const groupedSeating = Object.entries(SEATING_OPTIONS);
  
  // Filter menu items based on search query
  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const groupedMenu = filteredMenuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

if (showReceipt && receiptData) {
  const rawTotal = receiptData.subtotal + receiptData.tax - receiptData.discount;

  const finalTotal = Math.round(rawTotal);

  // convert to number so we can compare properly
  const roundOff = +(finalTotal - rawTotal).toFixed(2);

  return (
    <div className="min-h-screen bg-gray-100 p-2">
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            zoom: 1.25;
          }

          .no-print {
            display: none !important;
          }

          .receipt-box {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 10px !important;
            width: 80mm !important;
            font-size: 13px !important;
            font-weight: 700 !important;
            line-height: 1.35 !important;
          }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }

          th, td {
            padding-right: 4px !important;
          }
        }
      `}</style>

      <div
        className="mx-auto bg-white receipt-box print-content"
        style={{
          width: "80mm",
          fontFamily: "Courier New, monospace",
          fontSize: "13px",
          lineHeight: "1.35",
          padding: "10px",
          fontWeight: "700",
          paddingRight: "12px", // ✅ IMPORTANT: prevents cutting off .00
        }}
      >
        {/* HEADER */}
        <div className="text-center">
          <div className="font-bold text-lg">DOWNTOWN RESTRO & BAR</div>
          <div>East Majhitar 737136</div>
          <div>Near V Guard, SMIT Road</div>
          <div>Phone: 9635460927</div>
          <div className="font-bold">GSTIN: 112500000202TMP</div>
        </div>

        <hr className="border-t border-dashed border-black my-1" />

        {/* BILL INFO */}
        <div style={{ fontSize: "12px" }}>
          <div className="flex justify-between">
            <span>Order No:</span>
            <span className="font-bold">{receiptData.order_number}</span>
          </div>
          <div className="flex justify-between">
            <span>Table:</span>
            <span className="font-bold">{receiptData.table_name}</span>
          </div>
          <div className="flex justify-between">
            <span>Date:</span>
            <span>{new Date(receiptData.created_at).toLocaleString()}</span>
          </div>
        </div>

        <hr className="border-t border-dashed border-black my-1" />

        {/* ITEMS TABLE */}
        <table style={{ width: "100%", fontSize: "12px" }}>
          <thead>
            <tr style={{ borderBottom: "1px dashed black" }}>
              <th style={{ textAlign: "left", width: "45%" }}>Item</th>
              <th style={{ textAlign: "center", width: "10%" }}>Qty</th>
              <th style={{ textAlign: "right", width: "20%" }}>Rate</th>
              <th style={{ textAlign: "right", width: "25%", paddingRight: "6px" }}>
                Amt
              </th>
            </tr>
          </thead>

          <tbody>
            {receiptData.items.map((item, index) => (
              <tr key={index}>
                <td style={{ paddingTop: "3px" }}>{item.name}</td>
                <td style={{ textAlign: "center" }}>{item.quantity}</td>
                <td style={{ textAlign: "right" }}>{item.price.toFixed(2)}</td>
                <td style={{ textAlign: "right", paddingRight: "6px" }}>
                  {(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <hr className="border-t border-dashed border-black my-1" />

        {/* TOTALS */}
        <div style={{ fontSize: "12px" }}>
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>{receiptData.subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>GST ({taxRate}%):</span>
            <span>{receiptData.tax.toFixed(2)}</span>
          </div>

          {receiptData.discount > 0 && (
            <div className="flex justify-between">
              <span>Discount:</span>
              <span>-{receiptData.discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Total:</span>
            <span>{rawTotal.toFixed(2)}</span>
          </div>

          {/* SHOW ROUND OFF ONLY IF NOT ZERO */}
          {roundOff !== 0 && (
            <div className="flex justify-between">
              <span>Rounded Off:</span>
              <span>
                {roundOff > 0 ? "+" : ""}
                {roundOff.toFixed(2)}
              </span>
            </div>
          )}

          <hr className="border-t border-black my-1" />

          <div className="flex justify-between font-bold text-lg">
            <span>NET PAYABLE</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <hr className="border-t border-dashed border-black my-1" />

        {/* FOOTER */}
        <div className="text-center" style={{ fontSize: "11px" }}>
          <div>THANK YOU, VISIT AGAIN!</div>
        </div>

        {/* BUTTONS */}
        <div className="no-print mt-3 flex justify-center gap-3">
          <button
            onClick={printReceipt}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Print
          </button>
          <button
            onClick={closeReceipt}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Table Selection & Menu */}
        <div className="lg:col-span-2 space-y-4">
          {/* Table Selection */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-xl font-bold mb-4">Select Table / Seating</h2>
            <div className="space-y-4">
              {groupedSeating.map(([category, seats]) => (
                <div key={category}>
                  <h3 className="font-semibold text-gray-700 mb-2">{category}</h3>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {seats.map(seat => (
                      <button
                        key={seat}
                        onClick={() => setSelectedTable(seat)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          selectedTable === seat
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white border-gray-300 hover:border-blue-400'
                        }`}
                      >
                        {seat.replace(/^(Counter Seat|Table|Cabin) /, '')}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          {selectedTable && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">Menu Items</h2>
              
              {/* Search Bar */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="🔍 Search menu items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                />
              </div>
              
              <div className="space-y-4">
                {Object.entries(groupedMenu).map(([category, items]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-gray-700 mb-2 uppercase text-sm">{category}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {items.filter(item => item.available).map(item => (
                        <button
                          key={item.id}
                          onClick={() => addToCart(item)}
                          className="p-3 text-left border rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-all"
                        >
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-blue-600 font-bold">₹{item.price.toFixed(2)}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                {Object.keys(groupedMenu).length === 0 && (
                  <p className="text-gray-500 text-center py-4">No menu items available. Add items in Menu Management.</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Cart & Billing */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-4 sticky top-4">
            <h2 className="text-xl font-bold mb-4">
              {selectedTable || 'Select a Table'}
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Cart is empty</p>
            ) : (
              <>
                {/* Custom Item Section */}
                <div className="mb-4 p-3 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <h3 className="font-semibold text-sm mb-2 text-yellow-800">Add Custom Item (Not in Menu)</h3>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={customItemName}
                      onChange={(e) => setCustomItemName(e.target.value)}
                      className="w-full border rounded px-3 py-2 text-sm"
                    />
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Price (₹)"
                        value={customItemPrice}
                        onChange={(e) => setCustomItemPrice(e.target.value)}
                        className="flex-1 border rounded px-3 py-2 text-sm"
                        step="0.01"
                        min="0"
                      />
                      <button
                        onClick={addCustomItem}
                        className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 text-sm font-semibold"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="border rounded p-2">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-sm">{item.name}</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-xs"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                          >
                            -
                          </button>
                          <span className="font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>GST:</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={taxRate}
                        onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                        className="w-16 border rounded px-2 py-1 text-right"
                        min="0"
                        step="0.5"
                      />
                      <span>%</span>
                      <span className="font-bold">₹{tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span>Discount:</span>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        className="w-16 border rounded px-2 py-1 text-right"
                        min="0"
                        max="100"
                        step="1"
                      />
                      <span>%</span>
                      <span className="font-bold text-green-600">-₹{discountAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-xl font-bold border-t pt-2">
                    <span>TOTAL:</span>
                    <span className="text-blue-600">₹{total.toFixed(2)}</span>
                  </div>

                  <button
                    onClick={generateBill}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-bold mt-4"
                  >
                    Generate Bill
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default POSPage;
