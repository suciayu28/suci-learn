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

     {/* MODAL ADD CUSTOMER DENGAN EFEK BLUR */}
      {showForm && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-white/30 p-4"
          onClick={() => setShowForm(false)}
        >
          <div 
            className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl border border-white/50 text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Add New Customer</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">Customer ID</label>
                <input 
                  type="text" 
                  placeholder="Auto-generated" 
                  className="w-full mt-1 p-3 border border-gray-100 rounded-2xl bg-gray-50 text-gray-400 outline-none cursor-not-allowed" 
                  disabled 
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">Name</label>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="w-full mt-1 p-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all" 
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">Email</label>
                <input 
                  type="email" 
                  placeholder="email@mail.com" 
                  className="w-full mt-1 p-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all" 
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">Phone</label>
                <input 
                  type="text" 
                  placeholder="0812..." 
                  className="w-full mt-1 p-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all" 
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 ml-1">Loyalty Level</label>
                <select className="w-full mt-1 p-3 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all appearance-none bg-white">
                  <option>Bronze</option>
                  <option>Silver</option>
                  <option>Gold</option>
                </select>
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
                Save Customer
              </button>
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