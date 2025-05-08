export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="flex items-center justify-between bg-white/40 dark:bg-gray-700/60 backdrop-blur p-3 rounded-xl shadow hover:scale-[1.02] transform transition">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 accent-indigo-500"
        />
        <span
          className={`text-lg ${
            todo.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-white"
          }`}
        >
          {todo.text}
        </span>
      </div>
      <button
        onClick={onDelete}
        className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 hover:scale-105 transform transition"
      >
        Hapus
      </button>
    </div>
  );
}
