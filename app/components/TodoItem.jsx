export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition">
      <div
        onClick={() => onToggle(todo.id)}
        className={`cursor-pointer flex-1 ${
          todo.completed ? "line-through text-gray-400" : "text-gray-800 dark:text-white"
        }`}
      >
        {todo.text}
      </div>
      <button
        onClick={onDelete}
        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition"
      >
        Hapus
      </button>
    </div>
  );
}
