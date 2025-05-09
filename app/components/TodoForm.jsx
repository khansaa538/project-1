'use client';

import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function TodoForm({ userId }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await addDoc(collection(db, 'todos'), {
        text,
        completed: false,
        userId,
        createdAt: serverTimestamp(),
      });
      setText('');
    } catch (err) {
      console.error('Error menambah tugas:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Tambah tugas baru..."
        className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-400 dark:bg-gray-700 dark:text-white"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition"
      >
        Tambah
      </button>
    </form>
  );
}
