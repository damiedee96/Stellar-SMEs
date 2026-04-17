import React from 'react';

export default function StatCard({ label, value, icon, color = 'blue' }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
  };

  return (
    <div className={`rounded-xl p-5 ${colors[color]} flex items-center gap-4`}>
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="text-sm font-medium opacity-70">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
