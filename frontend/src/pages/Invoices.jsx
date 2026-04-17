import React, { useEffect, useState } from 'react';
import client from '../api/client';

export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [form, setForm] = useState({
    recipient_email: '', amount: '', currency: 'USD', description: '', due_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  async function fetchInvoices() {
    const { data } = await client.get('/payments/invoices');
    setInvoices(data);
  }

  useEffect(() => { fetchInvoices(); }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      await client.post('/payments/invoice', form);
      setSuccess('Invoice created successfully');
      setForm({ recipient_email: '', amount: '', currency: 'USD', description: '', due_date: '' });
      fetchInvoices();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Invoices</h2>

      {success && <p className="text-green-600 text-sm">{success}</p>}

      <form onSubmit={handleCreate} className="bg-white rounded-2xl shadow p-6 space-y-4 max-w-lg">
        <h3 className="font-semibold">Create Invoice</h3>
        <input
          type="email" placeholder="Recipient email" required
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stellar-light"
          value={form.recipient_email}
          onChange={(e) => setForm({ ...form, recipient_email: e.target.value })}
        />
        <div className="flex gap-3">
          <input
            type="number" step="0.01" min="0" placeholder="Amount" required
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stellar-light"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <select
            className="border rounded-lg px-4 py-2"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          >
            <option>USD</option><option>EUR</option><option>GBP</option><option>XLM</option>
          </select>
        </div>
        <input
          type="text" placeholder="Description"
          className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stellar-light"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div>
          <label className="block text-sm font-medium mb-1">Due Date</label>
          <input
            type="date"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stellar-light"
            value={form.due_date}
            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
          />
        </div>
        <button
          type="submit" disabled={loading}
          className="w-full bg-stellar-blue text-white py-2 rounded-lg hover:bg-stellar-light transition disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Invoice'}
        </button>
      </form>

      {/* Invoice list */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">Recipient</th>
              <th className="px-6 py-3 text-left">Description</th>
              <th className="px-6 py-3 text-right">Amount</th>
              <th className="px-6 py-3 text-left">Due</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {invoices.length === 0 && (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No invoices yet</td></tr>
            )}
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50">
                <td className="px-6 py-3">{inv.recipient_email}</td>
                <td className="px-6 py-3 text-gray-500">{inv.description || '—'}</td>
                <td className="px-6 py-3 text-right font-semibold">{inv.amount} {inv.currency}</td>
                <td className="px-6 py-3 text-gray-500">{inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}</td>
                <td className="px-6 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${inv.status === 'unpaid' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
