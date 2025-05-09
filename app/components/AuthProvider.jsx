'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const register = (email, password) => createUserWithEmailAndPassword(auth, email, password);
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  return (
    <AuthContext.Provider value={{ user, register, login }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
