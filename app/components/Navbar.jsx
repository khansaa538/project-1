'use client';

import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow px-4 py-3 mb-6">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="text-xl font-bold text-pink-600 dark:text-pink-300">
          To-Do App
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          {user && (
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
