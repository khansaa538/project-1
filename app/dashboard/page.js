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
    <div className="min-h-screen bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 p-6 text-white">
      {/* NAVIGATION */}
      <header className="flex justify-between items-center mb-8 bg-gradient-to-r from-teal-500 to-purple-600 p-4 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold">Hai, {user.email}</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-white text-teal-600 px-4 py-2 rounded-full hover:bg-teal-100 transition"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </header>

      {/* STATISTICS + CHART */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-gray-500 dark:text-gray-400">Total Tugas</h3>
              <p className="text-3xl font-semibold">{totalCount}</p>
            </div>
            <div>
              <h3 className="text-gray-500 dark:text-gray-400">Selesai</h3>
              <p className="text-3xl font-semibold">{completedCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                fill="#8884d8"
                label
                isAnimationActive={true}
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
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Tambah Tugas Baru</h2>
        <form onSubmit={addTodo} className="flex gap-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Masukkan tugas baru"
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring focus:ring-teal-300 dark:bg-gray-700 dark:text-white"
          />
          <button
            type="submit"
            className="bg-teal-500 text-white px-6 py-3 rounded-lg hover:bg-teal-600 transition"
          >
            Tambah
          </button>
        </form>
      </section>

      {/* TODO LIST */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">Daftar Tugas</h2>
        {todos.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Belum ada tugas. Tambahkan tugas baru!</p>
        ) : (
          <div className="space-y-4">
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

      {/* LOGOUT BUTTON */}
      <div className="mt-8 text-center">
        <button
          onClick={logout}
          className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
