import { useState, useEffect } from "react";

const API_URL = "http://localhost:3001/api";

const SEATING_OPTIONS = {
  "Counter Seats": ["Counter Seat 1", "Counter Seat 2"],
  Tables: ["Table 1", "Table 2", "Table 3", "Table 4", "Table 5"],
  Cabins: ["Cabin 1", "Cabin 2", "Cabin 3", "Cabin 4", "Cabin 5"],
};

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [filterDate, setFilterDate] = useState("");
  const [filterTable, setFilterTable] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // DELETE ORDER POPUP
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [orderToDelete, setOrderToDelete] = useState(null);

  // CLEAR HISTORY POPUP
  const [showClearPopup, setShowClearPopup] = useState(false);
  const [clearPassword, setClearPassword] = useState("");

  // MESSAGE POPUP (instead of alert)
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [messageText, setMessageText] = useState("");

  const allTables = Object.values(SEATING_OPTIONS).flat();

  useEffect(() => {
    fetchOrders();
  }, [filterDate, filterTable]);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      if (filterDate) params.append("date", filterDate);
      if (filterTable) params.append("table", filterTable);

      const response = await fetch(`${API_URL}/orders?${params}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
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

  // ============================
  // DELETE SINGLE ORDER
  // ============================
  const deleteOrder = async () => {
    if (!orderToDelete) return;

    if (!deletePassword) {
      setMessageText("Please enter password!");
      setShowMessagePopup(true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders/${orderToDelete}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deletePassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessageText(data.error || "Failed to delete order");
        setShowMessagePopup(true);
        return;
      }

      setMessageText("Order deleted successfully!");
      setShowMessagePopup(true);

      setShowDeletePopup(false);
      setDeletePassword("");
      setOrderToDelete(null);
      setSelectedOrder(null);

      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      setMessageText("Error deleting order");
      setShowMessagePopup(true);
    }
  };

  // ============================
  // CLEAR ALL HISTORY
  // ============================
  const clearHistory = async () => {
    if (!clearPassword) {
      setMessageText("Please enter password!");
      setShowMessagePopup(true);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/orders/clear`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: clearPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessageText(data.error || "Failed to clear history");
        setShowMessagePopup(true);
        return;
      }

      setMessageText("All order history cleared successfully!");
      setShowMessagePopup(true);

      setShowClearPopup(false);
      setClearPassword("");
      setSelectedOrder(null);

      fetchOrders();
    } catch (error) {
      console.error("Error clearing history:", error);
      setMessageText("Error clearing history");
      setShowMessagePopup(true);
    }
  };

  // ============================
  // RECEIPT VIEW
  // ============================
  if (selectedOrder) {
    const formattedDateTime = new Date(selectedOrder.created_at).toLocaleString(
      [],
      {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }
    );

    const subtotalInt = Math.floor(selectedOrder.subtotal);
    const taxInt = Math.floor(selectedOrder.tax);
    const discountInt = Math.floor(selectedOrder.discount);
    const finalTotal = Math.floor(subtotalInt + taxInt - discountInt);

    return (
      <div className="min-h-screen bg-gray-100 p-2 relative">
        <style>{`
          @media print {
            @page {
              size: 80mm auto;
              margin: 2mm;
            }

            body {
              margin: 0;
              padding: 0;
            }

            .no-print {
              display: none !important;
            }

            .receipt-box {
              box-shadow: none !important;
              margin: 0 auto !important;
              padding: 6px !important;
              width: 72mm !important;
              font-size: 13px !important;
              font-weight: 700 !important;
              line-height: 1.3 !important;
            }

            table {
              width: 100% !important;
              table-layout: fixed !important;
              border-collapse: collapse !important;
            }

            th, td {
              padding: 1px 0 !important;
              font-size: 13px !important;
              overflow: hidden !important;
              text-overflow: ellipsis !important;
              white-space: nowrap !important;
            }

            td:last-child, th:last-child {
              padding-right: 4px !important;
            }
          }
        `}</style>

        <div
          className="mx-auto bg-white receipt-box print-content"
          style={{
            width: "72mm",
            fontFamily: "Courier New, monospace",
            fontSize: "13px",
            lineHeight: "1.3",
            padding: "6px",
            fontWeight: "700",
          }}
        >
          {/* HEADER */}
          <div className="text-center">
            <div style={{ fontSize: "19px", fontWeight: "1000" }}>
              DOWNTOWN RESTRO & BAR
            </div>
            <div>East Majhitar 737136</div>
            <div>Near V Guard, SMIT Road</div>
            <div>Phone: 9635460927</div>
            <div style={{ fontWeight: "900" }}>GSTIN: 112500000202TMP</div>
          </div>

          <hr className="border-t border-dashed border-black my-1" />

          {/* BILL INFO */}
          <div style={{ fontSize: "12px" }}>
            <div className="flex justify-between">
              <span>Order No:</span>
              <span style={{ fontWeight: "900" }}>
                {selectedOrder.order_number}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Table:</span>
              <span style={{ fontWeight: "900" }}>
                {selectedOrder.table_name}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Date:</span>
              <span>{formattedDateTime}</span>
            </div>
          </div>

          <hr className="border-t border-dashed border-black my-1" />

          {/* ITEMS TABLE */}
          <table style={{ width: "100%", fontSize: "12px" }}>
            <thead>
              <tr style={{ borderBottom: "1px dashed black" }}>
                <th style={{ textAlign: "left", width: "50%" }}>Item</th>
                <th style={{ textAlign: "center", width: "10%" }}>Qty</th>
                <th style={{ textAlign: "right", width: "20%" }}>Rate</th>
                <th style={{ textAlign: "right", width: "20%" }}>Amt</th>
              </tr>
            </thead>

            <tbody>
              {selectedOrder.items.map((item, index) => (
                <tr key={index}>
                  <td style={{ paddingTop: "2px" }}>{item.name}</td>
                  <td style={{ textAlign: "center" }}>{item.quantity}</td>
                  <td style={{ textAlign: "right" }}>
                    {Math.floor(item.price)}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {Math.floor(item.price * item.quantity)}
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
              <span>{subtotalInt}</span>
            </div>

            <div className="flex justify-between">
              <span>GST:</span>
              <span>{taxInt}</span>
            </div>

            {selectedOrder.discount > 0 && (
              <div className="flex justify-between">
                <span>Discount:</span>
                <span>-{discountInt}</span>
              </div>
            )}

            <hr className="border-t border-black my-1" />

            <div
              className="flex justify-between"
              style={{ fontWeight: "900", fontSize: "16px" }}
            >
              <span>NET PAYABLE</span>
              <span>₹{finalTotal}</span>
            </div>
          </div>

          <hr className="border-t border-dashed border-black my-1" />

          {/* FOOTER */}
          <div
            className="text-center"
            style={{ fontSize: "11px", fontWeight: "900" }}
          >
            <div>THANK YOU, VISIT AGAIN!</div>
          </div>

          {/* BUTTONS */}
          <div className="no-print mt-3 flex justify-center gap-3">
            <button
              onClick={printOrder}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Print
            </button>

            <button
              onClick={closeOrderDetails}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm"
            >
              Close
            </button>

            <button
              onClick={() => {
                setOrderToDelete(selectedOrder.id);
                setShowDeletePopup(true);
              }}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>

        {/* DELETE POPUP */}
        {showDeletePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[9999] no-print">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-bold mb-4 text-center text-red-600">
                Delete Order
              </h2>

              <p className="text-sm text-gray-600 mb-3 text-center">
                Enter password to delete this order
              </p>

              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Enter Password"
                className="w-full border px-3 py-2 rounded mb-4"
              />

              <div className="flex justify-between gap-2">
                <button
                  onClick={() => {
                    setShowDeletePopup(false);
                    setDeletePassword("");
                    setOrderToDelete(null);
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>

                <button
                  onClick={deleteOrder}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MESSAGE POPUP */}
        {showMessagePopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] no-print">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
              <h2 className="text-lg font-bold mb-3">Message</h2>
              <p className="text-gray-700 mb-4">{messageText}</p>
              <button
                onClick={() => setShowMessagePopup(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================
  // MAIN ORDER HISTORY PAGE
  // ============================
  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order History</h1>

          <button
            onClick={() => setShowClearPopup(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 font-bold"
          >
            Clear History
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Filter by Date
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Filter by Table
            </label>
            <select
              value={filterTable}
              onChange={(e) => setFilterTable(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Tables</option>
              {allTables.map((table) => (
                <option key={table} value={table}>
                  {table}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterDate("");
                setFilterTable("");
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
              <div className="text-2xl font-bold text-blue-600">
                {orders.length}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Total Revenue</div>
              <div className="text-2xl font-bold text-green-600">
                ₹{Math.floor(getTotalRevenue())}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-600">Average Order</div>
              <div className="text-2xl font-bold text-purple-600">
                ₹
                {orders.length > 0
                  ? Math.floor(getTotalRevenue() / orders.length)
                  : "0.00"}
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => viewOrderDetails(order)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <span className="font-bold text-blue-600">
                      #{order.order_number}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                      {order.table_name}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleString([], {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </div>

                  <div className="text-sm text-gray-600 mt-1">
                    {order.items.length} item(s)
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{Math.floor(order.total)}
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 text-sm mt-2">
                    View Details →
                  </button>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No orders found. Try adjusting the filters.
            </p>
          )}
        </div>
      </div>

      {/* CLEAR HISTORY POPUP */}
      {showClearPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[9999] no-print">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-lg font-bold mb-4 text-center text-red-600">
              Clear All History
            </h2>

            <p className="text-sm text-gray-600 mb-3 text-center">
              Enter password to clear all order history
            </p>

            <input
              type="password"
              value={clearPassword}
              onChange={(e) => setClearPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-full border px-3 py-2 rounded mb-4"
            />

            <div className="flex justify-between gap-2">
              <button
                onClick={() => {
                  setShowClearPopup(false);
                  setClearPassword("");
                }}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>

              <button
                onClick={clearHistory}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MESSAGE POPUP */}
      {showMessagePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999] no-print">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-bold mb-3">Message</h2>
            <p className="text-gray-700 mb-4">{messageText}</p>
            <button
              onClick={() => setShowMessagePopup(false)}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
