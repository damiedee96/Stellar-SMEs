import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import useAuthStore from '../store/authStore';

export default function Register() {
  const [form, setForm] = useState({ business_name: '', email: '', password: '', currency: 'USD' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await client.post('/auth/register', form);
      setAuth(data.token, data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-stellar-blue mb-6">Create your account</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Business Name"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stellar-light"
            value={form.business_name}
            onChange={(e) => setForm({ ...form, business_name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stellar-light"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stellar-light"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-stellar-light"
            value={form.currency}
            onChange={(e) => setForm({ ...form, currency: e.target.value })}
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="XLM">XLM</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-stellar-blue text-white py-2 rounded-lg hover:bg-stellar-light transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p className="text-sm text-center mt-4 text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-stellar-light hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
