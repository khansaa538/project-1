import Navbar from '../../components/Navbar';

export default function Dashboard() {
  const { user } = useAuth();
  // ... (state & effect yang sudah kita buat)

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-300 dark:from-pink-900 dark:to-pink-700">
        <Navbar />
        <div className="max-w-5xl mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-pink-700 dark:text-pink-300">
            Dashboard To-Do List
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <ChartCard data={chartData} title="Statistik Tugas" />
            <div className="md:col-span-2 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
              <TodoForm userId={user.uid} />
              <TodoList userId={user.uid} />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
