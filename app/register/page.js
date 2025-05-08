"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600">
      <div className="bg-white dark:bg-gray-900 p-10 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-extrabold mb-6 text-center dark:text-white text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-teal-400">
          Daftar Akun
        </h1>
        <form onSubmit={handleRegister} className="space-y-5">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-300 dark:bg-gray-800 dark:text-white"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-3 border rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-300 dark:bg-gray-800 dark:text-white"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-lime-400 to-fuchsia-500 text-white p-3 rounded-xl font-semibold shadow hover:scale-105 transition"
          >
            Daftar
          </button>
        </form>
        <p className="mt-5 text-center text-sm dark:text-gray-300">
          Sudah punya akun?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-lime-200 cursor-pointer hover:underline"
          >
            Login di sini
          </span>
        </p>
      </div>
    </div>
  );
}
