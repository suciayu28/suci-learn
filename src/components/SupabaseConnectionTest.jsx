import React, { useState, useEffect } from 'react';
import { testConnection } from '../lib/supabase';

const SupabaseConnectionTest = () => {
  const [status, setStatus] = useState('loading');
  const [result, setResult] = useState(null);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      setStatus('loading');
      const testResult = await testConnection();
      setResult(testResult);
      setStatus(testResult.success ? 'success' : 'error');
    } catch (error) {
      setStatus('error');
      setResult({
        success: false,
        error: error.message,
        details: error
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 font-playfair">
          Supabase Connection Test
        </h2>
        <button
          onClick={checkConnection}
          disabled={status === 'loading'}
          className="px-4 py-2 bg-[#4F5C18] text-white rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-all disabled:opacity-50"
        >
          {status === 'loading' ? 'Testing...' : 'Test Again'}
        </button>
      </div>

      {status === 'loading' && (
        <div className="flex flex-col items-center py-8 text-gray-500">
          <div className="w-8 h-8 border-4 border-[#4F5C18] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-bold uppercase tracking-widest text-xs">Testing Connection...</p>
        </div>
      )}

      {status === 'success' && result && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center">
              ✓
            </div>
            <div>
              <p className="font-bold text-emerald-800">Connection Successful!</p>
              <p className="text-sm text-emerald-700">{result.message}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
              <p className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">Active Session</p>
              <p className="font-bold text-gray-800">{result.hasActiveSession ? 'Yes' : 'No'}</p>
            </div>
            {result.user && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-1">User Email</p>
                <p className="font-bold text-gray-800 text-sm truncate">{result.user.email}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {status === 'error' && result && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
            <div className="w-10 h-10 bg-rose-500 text-white rounded-full flex items-center justify-center">
              ✕
            </div>
            <div>
              <p className="font-bold text-rose-800">Connection Failed</p>
              <p className="text-sm text-rose-700">{result.error}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <p className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-2">Troubleshooting Steps:</p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Check your <code className="bg-gray-200 px-1 py-0.5 rounded">.env</code> file configuration</li>
              <li>Verify Supabase URL and Anon Key are correct</li>
              <li>Make sure your Supabase project is running</li>
              <li>Check if RLS policies are configured properly</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseConnectionTest;
