import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { getCRMData } from '../lib/crmData';

const SupabaseDebugger = () => {
  const [results, setResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addLog = (title, data, isError = false) => {
    setResults(prev => [...prev, {
      id: Date.now(),
      title,
      data: JSON.stringify(data, null, 2),
      isError
    }]);
  };

  const clearLogs = () => {
    setResults([]);
  };

  const testConnection = async () => {
    addLog('🔍 Testing Connection...', null);
    try {
      const { data, error } = await supabase
        .from('login')
        .select('count', { count: 'exact', head: true });
      if (error) throw error;
      addLog('✅ Connection OK', data);
    } catch (error) {
      addLog('❌ Connection Failed', error, true);
    }
  };

  const testInsertData = async () => {
    addLog('📝 Testing Insert Data...', null);
    try {
      const testEmail = `test${Date.now()}@example.com`;
      const { data, error } = await supabase
        .from('login')
        .insert([{
          email: testEmail,
          password: 'testpassword123',
          name: 'Test User',
          role: 'customer'
        }])
        .select();

      if (error) throw error;
      addLog('✅ Insert Successful!', data);
    } catch (error) {
      addLog('❌ Insert Failed', error, true);
    }
  };

  const testReadData = async () => {
    addLog('📖 Testing Read Data...', null);
    try {
      const { data, error } = await supabase
        .from('login')
        .select('*')
        .limit(5);

      if (error) throw error;
      addLog('✅ Read Successful!', data);
    } catch (error) {
      addLog('❌ Read Failed', error, true);
    }
  };

  const testDeleteTestData = async () => {
    addLog('🗑️ Deleting Test Data...', null);
    try {
      const { error } = await supabase
        .from('login')
        .delete()
        .ilike('email', '%test%@example.com');

      if (error) throw error;
      addLog('✅ Delete Successful!', 'Test data cleaned');
    } catch (error) {
      addLog('❌ Delete Failed', error, true);
    }
  };

  const seedMockData = async () => {
    setIsRunning(true);
    addLog('🌱 Seeding mock data to Supabase...', null);

    const db = getCRMData();
    let seeded = 0;
    let errors = [];

    // Seed customers
    if (db.customers && db.customers.length > 0) {
      try {
        const custPayloads = db.customers.slice(0, 10).map(c => ({
          full_name: c.name || c.full_name || 'Unknown',
          username: (c.name || '').toLowerCase().replace(/\s+/g, '_') + '_' + Date.now(),
          email: c.email || `mock_${Date.now()}@lumier.com`,
          phone: c.phone || '08000000000',
          address: c.address || 'Jakarta',
          loyalty_tier: c.loyalty || c.loyalty_tier || 'Bronze',
          membership_status: c.status || 'Active',
          source: c.source || 'Website',
          total_spent: parseFloat(c.totalTransactions || 0),
          total_transactions: parseInt(c.itemsCount || 0)
        }));
        const { data, error } = await supabase.from('customers').insert(custPayloads).select();
        if (error) errors.push('Customers: ' + error.message);
        else { seeded += data.length; addLog(`✅ Seeded ${data.length} customers`, data); }
      } catch (e) { errors.push('Customers: ' + e.message); }
    }

    // Seed feedback/reviews
    if (db.reviews && db.reviews.length > 0) {
      try {
        const revPayloads = db.reviews.slice(0, 10).map(r => ({
          customer_name: r.customerName || 'Customer',
          rating: r.rating || 5,
          comment: r.comment || '',
          sentiment: r.sentiment || 'Neutral',
          status: r.status || 'Pending',
          date: new Date().toISOString().split('T')[0],
          admin_reply: r.adminReply || null
        }));
        const { data, error } = await supabase.from('feedback').insert(revPayloads).select();
        if (error) errors.push('Feedback: ' + error.message);
        else { seeded += data.length; addLog(`✅ Seeded ${data.length} feedback entries`, data); }
      } catch (e) { errors.push('Feedback: ' + e.message); }
    }

    if (errors.length > 0) addLog('⚠️ Some errors during seeding', errors, true);
    else addLog(`🎉 Seeding complete! ${seeded} records inserted.`, { seeded });

    setIsRunning(false);
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);
    
    await testConnection();
    await testInsertData();
    await testReadData();
    await testDeleteTestData();
    
    setIsRunning(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800 font-playfair">Supabase Debugger</h1>
        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold uppercase"
        >
          Clear Logs
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={testConnection}
          disabled={isRunning}
          className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl text-blue-700 font-bold text-sm uppercase tracking-widest disabled:opacity-50"
        >
          1. Test Connection
        </button>
        <button
          onClick={testInsertData}
          disabled={isRunning}
          className="p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-xl text-green-700 font-bold text-sm uppercase tracking-widest disabled:opacity-50"
        >
          2. Test Insert
        </button>
        <button
          onClick={testReadData}
          disabled={isRunning}
          className="p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-xl text-purple-700 font-bold text-sm uppercase tracking-widest disabled:opacity-50"
        >
          3. Test Read
        </button>
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="p-4 bg-[#4F5C18] hover:bg-[#3d4713] border border-[#4F5C18] rounded-xl text-white font-bold text-sm uppercase tracking-widest disabled:opacity-50"
        >
          🚀 Run All Tests
        </button>
        <button
          onClick={seedMockData}
          disabled={isRunning}
          className="p-4 col-span-2 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl text-amber-800 font-bold text-sm uppercase tracking-widest disabled:opacity-50"
        >
          🌱 Seed Mock Data to Supabase (Customers + Feedback)
        </button>
      </div>

      <div className="space-y-4">
        {results.length === 0 ? (
          <div className="p-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
            <p className="font-bold">No logs yet!</p>
            <p className="text-sm">Run tests to see results</p>
          </div>
        ) : (
          results.map((result) => (
            <div
              key={result.id}
              className={`p-4 rounded-xl border ${
                result.isError
                  ? 'bg-rose-50 border-rose-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <p className={`font-bold mb-2 ${
                result.isError ? 'text-rose-700' : 'text-gray-800'
              }`}>
                {result.title}
              </p>
              <pre className="bg-white p-3 rounded-lg overflow-auto text-xs border">
                {result.data}
              </pre>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-2xl">
        <h3 className="font-bold text-yellow-800 mb-3">💡 Tips Jika Data Tidak Bisa Masuk:</h3>
        <ol className="text-sm text-yellow-700 space-y-2 list-decimal list-inside">
          <li>Jalankan <code className="bg-yellow-200 px-1 rounded">fix_rls_all_tables.sql</code> di Supabase SQL Editor</li>
          <li>Pastikan nama tabel <strong>login</strong> ada di Supabase</li>
          <li>Cek struktur kolom tabel login harus: <code>id, email, password, name, role, created_at, updated_at</code></li>
          <li>Pastikan environment variables <code>VITE_SUPABASE_URL</code> dan <code>VITE_SUPABASE_ANON_KEY</code> benar</li>
        </ol>
      </div>
    </div>
  );
};

export default SupabaseDebugger;
