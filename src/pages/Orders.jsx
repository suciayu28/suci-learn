import { useState } from "react";
import PageHeader from "../components/PageHeader";

const Orders = () => {
  const [showForm, setShowForm] = useState(false);

  const orderData = Array.from({ length: 30 }, (_, i) => ({
    orderId: `ORD-${(i + 1).toString().padStart(3, '0')}`,
    customerName: ["Joko Anwar", "Indra Bruggman", "Gilang Dirga", "Hana Pertiwi"][i % 4],
    status: ["Pending", "Completed", "Cancelled"][i % 3],
    totalPrice: Math.floor(Math.random() * 500000) + 50000,
    date: `2026-04-${(i % 28) + 1}`
  }));

  return (
    <div>
      <PageHeader title="Orders List" breadcrumb="Dashboard / Orders">
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
          onClick={() => setShowForm(true)}
        >
          + Add Orders
        </button>
      </PageHeader>

      {/* MODAL ADD ORDERS DENGAN EFEK BLUR */}
      {showForm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30 p-4"
          onClick={() => setShowForm(false)} // Tutup modal jika klik di area blur
        >
          <div 
            className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white/50 text-left"
            onClick={(e) => e.stopPropagation()} // Supaya klik di dalam form tidak menutup modal
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Order</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">Order ID</label>
                <input type="text" placeholder="ORD-000" className="w-full mt-1 p-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all" />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">Customer Name</label>
                <input type="text" placeholder="Nama Lengkap" className="w-full mt-1 p-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all" />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">Status</label>
                <select className="w-full mt-1 p-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all appearance-none bg-white">
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold text-gray-700 ml-1">Total Price</label>
                  <input type="number" placeholder="0" className="w-full mt-1 p-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all" />
                </div>
                <div>
                  <label className="text-sm font-bold text-gray-700 ml-1">Order Date</label>
                  <input type="date" className="w-full mt-1 p-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => setShowForm(false)} 
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowForm(false)} 
                className="flex-1 py-3 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-600 active:scale-95 transition-all"
              >
                Save Order
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto mt-6">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Order ID</th>
              <th className="p-4 font-semibold text-gray-600">Customer Name</th>
              <th className="p-4 font-semibold text-gray-600">Status</th>
              <th className="p-4 font-semibold text-gray-600">Total Price</th>
              <th className="p-4 font-semibold text-gray-600">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {orderData.map((order) => (
              <tr key={order.orderId} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="p-4 text-sm font-medium text-gray-800">{order.orderId}</td>
                <td className="p-4 text-sm text-gray-700">{order.customerName}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-600' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                  }`}>{order.status}</span>
                </td>
                <td className="p-4 text-sm text-gray-700">Rp {order.totalPrice.toLocaleString('id-ID')}</td>
                <td className="p-4 text-sm text-gray-600">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;