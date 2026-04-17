import React, { useEffect, useState } from 'react';
import client from '../api/client';

const TYPE_COLORS = {
  send: 'text-red-600',
  expense: 'text-red-600',
  receive: 'text-green-600',
  income: 'text-green-600',
};

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ type: 'income', amount: '', currency: 'USD', description: '' });
  const [loading, setLoading] = useState(false);

  async function fetchTransactions() {
    const { data } = await client.get('/transactions');
    setTransactions(data);
  }

  useEffect(() => { fetchTransactions(); }, []);

  async function handleAdd(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post('/transactions', form);
      setForm({ type: 'income', amount: '', currency: 'USD', description: '' });
      fetchTransactions();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Transactions</h2>

      {/* Add entry */}
      <form onSubmit={handleAdd} className="bg-white rounded-2xl shadow p-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            className="border rounded-lg px-3 py-2"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number" step="0.01" min="0" placeholder="0.00" required
            className="border rounded-lg px-3 py-2 w-32"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Currency</label>
          <select
            className="border rounded-lg px-3 py-2"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          >
            <option>USD</option><option>EUR</option><option>GBP</option><option>XLM</option>
          </select>
        </div>
        <div className="flex-1 min-w-[160px]">
          <label className="block text-sm font-medium mb-1">Description</label>
          <input
            type="text" placeholder="Note"
            className="border rounded-lg px-3 py-2 w-full"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button
          type="submit" disabled={loading}
          className="bg-stellar-blue text-white px-5 py-2 rounded-lg hover:bg-stellar-light transition disabled:opacity-50"
        >
          Add
        </button>
      </form>

      {/* List */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Type</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {transactions.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No transactions yet</td></tr>
            )}
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</td>
                <td className={`px-6 py-3 font-medium capitalize ${TYPE_COLORS[tx.type] || ''}`}>{tx.type}</td>
                <td className="px-6 py-3 text-gray-600">{tx.description || '—'}</td>
                <td className={`px-6 py-3 text-right font-semibold ${TYPE_COLORS[tx.type] || ''}`}>
                  {tx.amount} {tx.currency}
                </td>
                <td className="px-6 py-3">
                  <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">{tx.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
