import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/payments', label: 'Payments', icon: '💸' },
  { to: '/transactions', label: 'Transactions', icon: '📋' },
  { to: '/invoices', label: 'Invoices', icon: '🧾' },
  { to: '/wallet', label: 'Wallet', icon: '💼' },
];

export default function Layout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-stellar-blue text-white flex flex-col">
        <div className="p-6 border-b border-blue-800">
          <h1 className="text-xl font-bold">Stellar SMEs</h1>
          <p className="text-sm text-blue-200 mt-1 truncate">{user?.business_name}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-blue-800 font-semibold' : 'hover:bg-blue-700'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full text-sm text-blue-200 hover:text-white py-2"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
