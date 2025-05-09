'use client';

import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import TodoItem from './TodoItem';

export default function TodoList({ userId }) {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'todos'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTodos(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [userId]);

  const toggleComplete = async (id, completed) => {
    await updateDoc(doc(db, 'todos', id), { completed });
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleComplete}
          onDelete={deleteTodo}
        />
      ))}
    </div>
  );
}
