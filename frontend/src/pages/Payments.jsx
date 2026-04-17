import React, { useState } from 'react';
import client from '../api/client';

export default function Payments() {
  const [form, setForm] = useState({ destination: '', amount: '', currency: 'XLM', description: '' });
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSend(e) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      const { data } = await client.post('/payments/send', form);
      setStatus({ type: 'success', message: `Payment sent! TX: ${data.tx_hash}` });
      setForm({ destination: '', amount: '', currency: 'XLM', description: '' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.error || 'Payment failed' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-2xl font-bold">Send Payment</h2>

      {status && (
        <div className={`rounded-lg p-4 text-sm ${status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSend} className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Destination Address</label>
          <input
            type="text"
            placeholder="Stellar public key (G...)"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stellar-light"
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            required
          />
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              step="0.0000001"
              min="0"
              placeholder="0.00"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stellar-light"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Asset</label>
            <select
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stellar-light"
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
            >
              <option value="XLM">XLM</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description (optional)</label>
          <input
            type="text"
            placeholder="Payment note"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stellar-light"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-stellar-blue text-white py-2 rounded-lg hover:bg-stellar-light transition disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Payment'}
        </button>
      </form>
    </div>
  );
}
