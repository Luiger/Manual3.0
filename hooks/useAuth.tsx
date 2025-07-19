// hooks/useAuth.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import apiClient from '../services/apiClient';

// --- Interfaces para definir la estructura de nuestros datos ---
interface User {
  Nombre: string;
  Apellido: string;
  Email: string;
  // Añade otros campos que necesites
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

// --- Creación del Contexto ---
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// --- Creación del Proveedor (Provider) ---
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          setToken(storedToken);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          const response = await UserService.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
          }
        }
      } catch (e) {
        console.error('Error al cargar datos de sesión:', e);
      } finally {
        setIsLoading(false);
      }
    }

    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    const response = await AuthService.login(email, password);
    if (response.success && response.token) {
      const newToken = response.token;
      setToken(newToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      const profileResponse = await UserService.getProfile();
      if (profileResponse.success && profileResponse.data) {
        setUser(profileResponse.data);
      }
      await SecureStore.setItemAsync('userToken', newToken);
      setIsLoading(false);
      return { success: true };
    }
    setIsLoading(false);
    return { success: false, error: response.error };
  };

  const logout = async () => {
    setIsLoading(true);
    await AuthService.logout();
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync('userToken');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Creación del Hook 'useAuth' ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};