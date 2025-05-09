'use client';

import { useState } from 'react';
import { useAuth } from '../../components/AuthProvider';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError('Login gagal: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-300 dark:from-pink-900 dark:to-pink-700">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center text-pink-700 dark:text-pink-300">Login</h1>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full px-4 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition"
          >
            Login
          </button>
        </form>
        <p className="text-center text-sm mt-4 dark:text-gray-300">
          Belum punya akun?{' '}
          <Link href="/register" className="text-pink-500 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
