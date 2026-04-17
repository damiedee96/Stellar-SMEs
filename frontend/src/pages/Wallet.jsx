import React, { useEffect, useState } from 'react';
import client from '../api/client';
import useAuthStore from '../store/authStore';

export default function Wallet() {
  const { user } = useAuthStore();
  const [balances, setBalances] = useState([]);
  const [stellarTxs, setStellarTxs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get('/wallet/balance'),
      client.get('/wallet/stellar-transactions'),
    ]).then(([balRes, txRes]) => {
      setBalances(balRes.data.balances);
      setStellarTxs(txRes.data);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Wallet</h2>

      {/* Public key */}
      <div className="bg-white rounded-2xl shadow p-6">
        <p className="text-sm text-gray-500 mb-1">Your Stellar Public Key</p>
        <p className="font-mono text-sm break-all text-stellar-blue">{user?.stellar_public_key}</p>
      </div>

      {/* Balances */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold mb-4">Balances</h3>
        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : balances.length === 0 ? (
          <p className="text-gray-400 text-sm">No balances found. Fund your testnet account via Friendbot.</p>
        ) : (
          <div className="space-y-2">
            {balances.map((b, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                <span className="font-medium">{b.asset}</span>
                <span className="text-stellar-blue font-semibold">{parseFloat(b.balance).toFixed(4)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stellar transactions */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold mb-4">Recent Stellar Transactions</h3>
        {stellarTxs.length === 0 ? (
          <p className="text-gray-400 text-sm">No on-chain transactions yet.</p>
        ) : (
          <div className="space-y-2 text-sm">
            {stellarTxs.map((tx) => (
              <div key={tx.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <div>
                  <p className="font-mono text-xs text-gray-500 truncate w-64">{tx.hash}</p>
                  <p className="text-gray-400 text-xs">{new Date(tx.created_at).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${tx.successful ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {tx.successful ? 'Success' : 'Failed'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
