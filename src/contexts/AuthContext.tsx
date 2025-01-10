import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

// Axios instance oluşturma
export const api = axios.create({
  baseURL: window.API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor - her istekte token ekleme
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

type User = {
  role?: string;
};

type AuthContextType = {
  user: User | null;
  api: typeof api;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null,
  api: api
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/auth/user`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Kullanıcı bilgileri alınamadı');
        }
        
        const data = await response.json();
        setUser(data.data);
      } catch (error) {
        console.error('Kullanıcı bilgileri alınamadı:', error);
        setUser(null);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, api }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 