import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import apiClient from '../services/apiClient';

interface User {
  Nombre: string;
  Apellido: string;
  Email: string;
  Telefono?: string;
  Institucion?: string;
  Cargo?: string;
}

// ✅ CAMBIO: Actualizamos la interfaz del contexto
interface AuthContextData {
  user: User | null;
  token: string | null;
  isSessionLoading: boolean; // Para la carga inicial de la app
  isLoginLoading: boolean;   // Para la acción del botón de login
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  // ✅ CAMBIO: Renombramos el estado de carga y añadimos uno nuevo
  const [isSessionLoading, setIsSessionLoading] = useState(true);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

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
        // ✅ CAMBIO: Este 'loading' corresponde a la carga de la sesión
        setIsSessionLoading(false);
      }
    }
    loadUserFromStorage();
  }, []);

  const login = async (email: string, password: string) => {
    // ✅ CAMBIO: Este 'loading' es solo para la acción de login
    setIsLoginLoading(true);
    try {
      const response = await AuthService.login(email, password);
      if (!response.success || !response.token) {
        throw new Error(response.error || 'Credenciales inválidas.');
      }
      const newToken = response.token;
      setToken(newToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      const profileResponse = await UserService.getProfile();
      if (profileResponse.success && profileResponse.data) {
        setUser(profileResponse.data);
      } else {
        console.warn('Login exitoso, pero no se pudo obtener el perfil.');
      }
      await SecureStore.setItemAsync('userToken', newToken);
      return { success: true };
    } catch (error: any) {
      await AuthService.logout();
      setUser(null);
      setToken(null);
      return { success: false, error: error.message };
    } finally {
      // ✅ CAMBIO: Detenemos el 'loading' de la acción de login
      setIsLoginLoading(false);
    }
  };

  const logout = async () => {
    // La lógica de logout se mantiene, pero sin manejar el loading aquí para simplicidad
    await AuthService.logout();
    delete apiClient.defaults.headers.common['Authorization'];
    setUser(null);
    setToken(null);
    await SecureStore.deleteItemAsync('userToken');
  };

  return (
    // ✅ CAMBIO: Pasamos los nuevos estados al provider
    <AuthContext.Provider value={{ user, token, isSessionLoading, isLoginLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};