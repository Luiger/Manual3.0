// services/auth.service.ts
import apiClient from './apiClient'; // <-- IMPORTAMOS EL NUEVO CLIENTE
import * as SecureStore from 'expo-secure-store';
import axios from 'axios'; // Solo para 'isAxiosError'

// --- Explicación del Archivo ---
// Este servicio encapsula toda la lógica para comunicarse con el backend
// en lo que respecta a la autenticación.

// --- Interfaces ---
interface AuthResponse {
  success: boolean;
  error?: string;
  token?: string;
}

interface VerifyOtpResponse {
  success: boolean;
  error?: string;
  resetToken?: string;
}

interface RegisterCredentialsResponse {
  success: boolean;
  error?: string;
  tempToken?: string;
}

// --- Función de Login ---
const login = async (email, password) => {
  try {
    // Usamos apiClient y solo pasamos el endpoint específico.
    const response = await apiClient.post('/auth/login', { email, password });
    if (response.data?.token) {
      await SecureStore.setItemAsync('userToken', response.data.token);
      return { success: true, token: response.data.token };
    }
    return { success: false, error: 'Respuesta inesperada.' };
  } catch (error) {
    // El manejo de errores detallado se mantiene.
    let errorMessage = 'Ocurrió un error inesperado.';
    if (axios.isAxiosError(error)) {
      errorMessage = error.response?.data?.message || 'Error de conexión.';
    }
    return { success: false, error: errorMessage };
  }
};

// --- Función de Registro (Paso 1) ---
const registerCredentials = async (email, password) => {
  try {
    const response = await apiClient.post('/auth/register/credentials', { email, password });
    return { success: true, tempToken: response.data.tempToken };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error inesperado.';
    return { success: false, error: errorMessage };
  }
};

// --- Función de Registro (Paso 2) ---
const registerProfile = async (profileData, tempToken) => {
  try {
    // El interceptor de apiClient no se usa aquí porque el token es temporal.
    // Mantenemos la lógica original para este caso específico.
    await apiClient.post('/auth/register/profile', profileData, {
      headers: { Authorization: `Bearer ${tempToken}` },
    });
    return { success: true };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error inesperado.';
    return { success: false, error: errorMessage };
  }
};

// --- Función para Solicitar Recuperación ---
const forgotPassword = async (email) => {
  try {
    await apiClient.post('/auth/forgot-password', { email });
    return { success: true };
  } catch (error) {
    // Esta lógica de seguridad se mantiene.
    return { success: false, error: 'Si el correo existe, se ha enviado un código.' };
  }
};

// --- Función para Verificar OTP ---
const verifyOtp = async (email, otp) => {
  try {
    const response = await apiClient.post('/auth/verify-otp', { email, otp });
    return { success: true, resetToken: response.data.resetToken };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Código inválido o expirado.';
    return { success: false, error: errorMessage };
  }
};

// --- Función para Resetear Contraseña ---
const resetPassword = async (password, resetToken) => {
  try {
    // Caso especial con token temporal, mantenemos la lógica original.
    await apiClient.post('/auth/reset-password', { password }, {
      headers: { Authorization: `Bearer ${resetToken}` },
    });
    return { success: true };
  } catch (error) {
    const errorMessage = axios.isAxiosError(error) ? error.response?.data?.message : 'Error inesperado.';
    return { success: false, error: errorMessage };
  }
};

// --- Función de Logout (Mantenida) ---
const logout = async () => {
  try {
    await SecureStore.deleteItemAsync('userToken');
  } catch (error) {
    console.error('Error durante el logout en el servicio:', error);
  }
};

export const AuthService = {
  login,
  registerCredentials,
  registerProfile,
  forgotPassword,
  verifyOtp,
  resetPassword,
  logout,
};