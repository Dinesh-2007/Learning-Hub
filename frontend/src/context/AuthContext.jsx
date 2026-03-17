import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      const token = localStorage.getItem('token');
      const saved = localStorage.getItem('user');

      if (token && saved) {
        setUser(JSON.parse(saved));
        try {
          const profile = await api.get('/auth/me');
          setUser(profile.data);
          localStorage.setItem('user', JSON.stringify(profile.data));
          return;
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      }

      try {
        const res = await api.post('/auth/login', { username: 'demo', password: 'password123' });
        localStorage.setItem('token', res.data.access_token);
        const me = await api.get('/auth/me');
        setUser(me.data);
        localStorage.setItem('user', JSON.stringify(me.data));
      } catch {
        setUser(null);
      }
    };

    bootstrapAuth().finally(() => setLoading(false));
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    localStorage.setItem('token', res.data.access_token);
    const me = await api.get('/auth/me');
    setUser(me.data);
    localStorage.setItem('user', JSON.stringify(me.data));
    return me.data;
  };

  const register = async (username, email, password, full_name) => {
    await api.post('/auth/register', { username, email, password, full_name });
    return login(username, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
