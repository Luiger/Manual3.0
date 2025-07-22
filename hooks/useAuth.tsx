// hooks/useAuth.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import apiClient from '../services/apiClient';

// ✅ CORRECCIÓN: Añadimos los campos opcionales a la interfaz del Usuario.
interface User {
  Nombre: string;
  Apellido: string;
  Email: string;
  Telefono?: string;
  Institucion?: string;
  Cargo?: string;
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
    try {
      // Intenta hacer el login
      const response = await AuthService.login(email, password);

      if (!response.success || !response.token) {
        // Si el login falla, lanzamos un error para ser capturado por el catch.
        throw new Error(response.error || 'Credenciales inválidas.');
      }

      // Si el login tiene éxito, procedemos a configurar la sesión
      const newToken = response.token;
      setToken(newToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      // Intentamos obtener el perfil del usuario
      const profileResponse = await UserService.getProfile();
      if (profileResponse.success && profileResponse.data) {
        setUser(profileResponse.data);
      } else {
        // Si el perfil falla, aún consideramos el login exitoso pero advertimos.
        console.warn('Login exitoso, pero no se pudo obtener el perfil.');
      }

      await SecureStore.setItemAsync('userToken', newToken);
      return { success: true };

    } catch (error: any) {
      // Si cualquier paso falla, lo capturamos aquí.
      //console.error('Error en el proceso de login:', error);
      // Limpiamos cualquier estado inconsistente.
      await AuthService.logout();
      setUser(null);
      setToken(null);
      return { success: false, error: error.message };
    } finally {
      // ✅ IMPORTANTE: Este bloque se ejecuta siempre, ya sea éxito o error.
      // Esto garantiza que el spinner de carga siempre se detenga.
      setIsLoading(false);
    }
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