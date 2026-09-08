import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthUser } from '../types';
import { api } from '../api/client';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (identifier: string, pass: string) => Promise<AuthUser>;
  register: (data: { fullName: string; phone: string; password: string; email?: string }) => Promise<AuthUser>;
  logout: () => void;
  updateCredentials: (data: {
    name: string;
    email: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<{ success: boolean; message: string }>;
  isAdmin: boolean;
  isStaffOrAdmin: boolean;
  isCustomer: boolean;
  mustChangePassword: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('iwacu_auth_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function verify() {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const data = await api.getMe();
        setUser(data.user);
      } catch (err) {
        console.warn('Failed to restore session:', err);
        logout();
      } finally {
        setIsLoading(false);
      }
    }
    verify();
  }, [token]);

  const login = async (identifier: string, pass: string) => {
    const data = await api.login(identifier, pass);
    localStorage.setItem('iwacu_auth_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (data: { fullName: string; phone: string; password: string; email?: string }) => {
    const res = await api.register(data);
    localStorage.setItem('iwacu_auth_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('iwacu_auth_token');
    setToken(null);
    setUser(null);
  };

  const updateCredentials = async (data: {
    name: string;
    email: string;
    phone?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => {
    const res = await api.updateCredentials(data);
    if (res.token) {
      localStorage.setItem('iwacu_auth_token', res.token);
      setToken(res.token);
    }
    setUser(res.user);
    return { success: true, message: res.message };
  };

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN';
  const isStaffOrAdmin = isAdmin || user?.role === 'STAFF';
  const isCustomer = user?.role === 'CUSTOMER';
  const mustChangePassword = !!(
    user &&
    isAdmin &&
    (user.mustChangePassword || user.isDefaultPassword || user.email.toLowerCase() === 'admin@iwacukids.rw')
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        updateCredentials,
        isAdmin,
        isStaffOrAdmin,
        isCustomer,
        mustChangePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
