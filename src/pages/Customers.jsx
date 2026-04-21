import { useState } from "react";
import PageHeader from "../components/PageHeader";

const Customers = () => {
  const [showForm, setShowForm] = useState(false);

  const customerData = Array.from({ length: 30 }, (_, i) => ({
    id: `C${(i + 1).toString().padStart(3, '0')}`,
    name: ["Budi Santoso", "Siti Aminah", "Andi Wijaya", "Dewi Lestari", "Eko Prasetyo"][i % 5],
    email: `user${i + 1}@mail.com`,
    phone: `081234567${i.toString().padStart(2, '0')}`,
    loyalty: ["Bronze", "Silver", "Gold"][i % 3]
  }));

  return (
    <div>
      <PageHeader title="Customer List" breadcrumb="Dashboard / Customers">
        <button 
          className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600 transition"
          onClick={() => setShowForm(true)}
        >
          + Add Customer
        </button>
      </PageHeader>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-xl">
            <h2 className="text-xl font-bold mb-4">Add New Customer</h2>
            <div className="space-y-3 text-left">
              <label className="text-sm font-semibold">Customer ID</label>
              <input type="text" placeholder="Auto-generated" className="w-full p-3 border rounded-xl bg-gray-50" disabled />
              <label className="text-sm font-semibold">Name</label>
              <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-xl" />
              <label className="text-sm font-semibold">Email</label>
              <input type="email" placeholder="email@mail.com" className="w-full p-3 border rounded-xl" />
              <label className="text-sm font-semibold">Phone</label>
              <input type="text" placeholder="0812..." className="w-full p-3 border rounded-xl" />
              <label className="text-sm font-semibold">Loyalty</label>
              <select className="w-full p-3 border rounded-xl">
                <option>Bronze</option>
                <option>Silver</option>
                <option>Gold</option>
              </select>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold">Cancel</button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 bg-green-500 text-white rounded-xl font-bold">Save</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-x-auto mt-6">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Customer ID</th>
              <th className="p-4 font-semibold text-gray-600">Name</th>
              <th className="p-4 font-semibold text-gray-600">Email</th>
              <th className="p-4 font-semibold text-gray-600">Phone</th>
              <th className="p-4 font-semibold text-gray-600">Loyalty</th>
            </tr>
          </thead>
          <tbody>
            {customerData.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className="p-4 text-sm text-gray-700">{item.id}</td>
                <td className="p-4 text-sm font-medium text-gray-800">{item.name}</td>
                <td className="p-4 text-sm text-gray-600">{item.email}</td>
                <td className="p-4 text-sm text-gray-600">{item.phone}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    item.loyalty === 'Gold' ? 'bg-yellow-100 text-yellow-600' :
                    item.loyalty === 'Silver' ? 'bg-gray-100 text-gray-600' : 'bg-orange-100 text-orange-600'
                  }`}>{item.loyalty}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;