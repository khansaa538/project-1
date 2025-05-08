"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { useRouter } from "next/navigation";
import TodoItem from "../components/TodoItem";
import { database } from "../lib/firebase";
import { ref, onValue, push, update, remove } from "firebase/database";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const tasksRef = ref(database, `tasks/${user.uid}`);
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const todosArray = Object.entries(data).map(([id, todo]) => ({
          id,
          ...todo,
        }));
        setTodos(todosArray);
      } else {
        setTodos([]);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, router]);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode");
    if (savedMode) setDarkMode(savedMode === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const tasksRef = ref(database, `tasks/${user.uid}`);
      await push(tasksRef, {
        text: newTodo,
        completed: false,
        createdAt: new Date().toISOString(),
      });
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todoRef = ref(database, `tasks/${user.uid}/${id}`);
      const todoToUpdate = todos.find((todo) => todo.id === id);
      await update(todoRef, {
        completed: !todoToUpdate.completed,
      });
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const todoRef = ref(database, `tasks/${user.uid}/${id}`);
      await remove(todoRef);
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  const chartData = [
    { name: "Selesai", value: completedCount },
    { name: "Belum Selesai", value: totalCount - completedCount },
  ];

  const COLORS = ["#34d399", "#f87171"];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 transition-colors">
      {/* NAVIGATION */}
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-700 dark:to-purple-800 text-white p-4 rounded-lg flex justify-between items-center mb-6 shadow">
        <h1 className="text-xl font-bold">Hai, {user.email}</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white text-indigo-600 px-3 py-1 rounded hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      {/* STATISTICS + CHART */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex justify-around">
          <div>
            <h3 className="text-gray-500 dark:text-gray-400">Total Tugas</h3>
            <p className="text-2xl font-bold dark:text-white">{totalCount}</p>
          </div>
          <div>
            <h3 className="text-gray-500 dark:text-gray-400">Selesai</h3>
            <p className="text-2xl font-bold dark:text-white">{completedCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
                isAnimationActive={true}
                animationDuration={800}
                animationEasing="ease-out"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* INPUT FORM */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Tambah Tugas Baru</h2>
        <form onSubmit={addTodo} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Masukkan tugas baru"
            className="flex-1 p-2 border rounded focus:outline-none focus:ring focus:border-indigo-300 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition"
          >
            Tambah
          </button>
        </form>
      </section>

      {/* TODO LIST */}
      <section className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Daftar Tugas</h2>
        {todos.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Belum ada tugas. Tambahkan tugas baru!</p>
        ) : (
          <div className="space-y-2">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={() => deleteTodo(todo.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* LOGOUT BUTTON AT BOTTOM */}
      <div className="mt-6 text-center">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
