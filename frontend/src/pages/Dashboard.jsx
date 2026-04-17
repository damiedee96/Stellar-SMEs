import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import client from '../api/client';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [cashflow, setCashflow] = useState([]);

  useEffect(() => {
    client.get('/dashboard/summary').then((r) => setSummary(r.data));
    client.get('/dashboard/cashflow').then((r) => setCashflow(r.data));
  }, []);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Income" value={`$${summary.total_income.toFixed(2)}`} icon="💰" color="green" />
          <StatCard label="Total Expenses" value={`$${summary.total_expenses.toFixed(2)}`} icon="📤" color="red" />
          <StatCard label="Net Cash Flow" value={`$${summary.net_cashflow.toFixed(2)}`} icon="📈" color="blue" />
          <StatCard label="Unpaid Invoices" value={summary.unpaid_invoices} icon="🧾" color="yellow" />
        </div>
      )}

      <div className="bg-white rounded-2xl shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Cash Flow (Last 30 Days)</h3>
        {cashflow.length === 0 ? (
          <p className="text-gray-400 text-sm">No data yet. Start recording transactions.</p>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={cashflow}>
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area type="monotone" dataKey="income" stroke="#1976D2" fill="#BBDEFB" name="Income" />
              <Area type="monotone" dataKey="expenses" stroke="#E53935" fill="#FFCDD2" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
