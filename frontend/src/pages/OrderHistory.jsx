import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

const SEATING_OPTIONS = {
  'Counter Seats': ['Counter Seat 1', 'Counter Seat 2'],
  'Tables': ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5'],
  'Cabins': ['Cabin 1', 'Cabin 2', 'Cabin 3', 'Cabin 4', 'Cabin 5']
};

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterTable, setFilterTable] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Get all table options as flat array
  const allTables = Object.values(SEATING_OPTIONS).flat();

  useEffect(() => {
    fetchOrders();
  }, [filterDate, filterTable]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (filterDate) params.append('date', filterDate);
      if (filterTable) params.append('table', filterTable);
      
      const response = await fetch(`${API_URL}/orders?${params}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
  };

  const closeOrderDetails = () => {
    setSelectedOrder(null);
  };

  const printOrder = () => {
    window.print();
  };

  const getTotalRevenue = () => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  };

  if (selectedOrder) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-2xl mx-auto bg-white shadow-lg print-content">
          <div className="p-6 text-center border-b-2 border-dashed border-gray-400">
            <h1 className="text-2xl font-bold">RESTAURANT NAME</h1>
            <p className="text-sm mt-1">Order Receipt</p>
          </div>

          <div className="p-6 border-b-2 border-dashed border-gray-400">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold">Order #:</span>
                <div className="font-bold">{selectedOrder.order_number}</div>
              </div>
              <div>
                <span className="font-semibold">Table:</span>
                <div className="font-bold">{selectedOrder.table_name}</div>
              </div>
              <div className="col-span-2">
                <span className="font-semibold">Date & Time:</span>
                <div>{new Date(selectedOrder.created_at).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="p-6 border-b-2 border-dashed border-gray-400">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-center py-2">Qty</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2">{item.name}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">₹{item.price.toFixed(2)}</td>
                    <td className="text-right">₹{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST/Tax:</span>
                <span>₹{selectedOrder.tax.toFixed(2)}</span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold border-t-2 border-gray-400 pt-2 mt-2">
                <span>TOTAL:</span>
                <span>₹{selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="p-4 no-print space-x-4 text-center border-t">
            <button
              onClick={printOrder}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Print Receipt
            </button>
            <button
              onClick={closeOrderDetails}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700"
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
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Order History</h1>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-1">Filter by Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Filter by Table</label>
            <select
              value={filterTable}
              onChange={(e) => setFilterTable(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Tables</option>
              {allTables.map(table => (
                <option key={table} value={table}>{table}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterDate('');
                setFilterTable('');
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600">Total Orders</div>
              <div className="text-2xl font-bold text-blue-600">{orders.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-2xl font-bold text-green-600">₹{getTotalRevenue().toFixed(2)}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Average Order</div>
              <div className="text-2xl font-bold text-purple-600">
                ₹{orders.length > 0 ? (getTotalRevenue() / orders.length).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {orders.map(order => (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => viewOrderDetails(order)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="font-bold text-blue-600">#{order.order_number}</span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                      {order.table_name}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {order.items.length} item(s)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">₹{order.total.toFixed(2)}</div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm mt-2">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <p className="text-gray-500 text-center py-8">No orders found. Try adjusting the filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderHistory;
