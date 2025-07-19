import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import { FormService } from '../services/form.service';
import Colors from '../constants/Colors';

// --- DEFINICIONES DEL FORMULARIO ---

// 1. Define la estructura del estado del formulario con claves simples
interface FormDataState {
  emailPrincipal: string;
  nombreInstitucion: string;
  siglasInstitucion: string;
  unidadGestion: string;
  unidadSistemas: string;
  unidadContratante: string;
  emailContacto: string;
}

// 2. Define los campos visibles para renderizarlos dinámicamente
const FORM_FIELDS: { key: keyof FormDataState; label: string; placeholder: string; keyboardType?: 'email-address' | 'default' }[] = [
  { key: 'emailPrincipal', label: 'Dirección de correo electrónico', placeholder: 'correo@institucion.com', keyboardType: 'email-address' },
  { key: 'nombreInstitucion', label: 'Nombre de la Institución / Ente / Órgano', placeholder: 'Ingrese el nombre completo' },
  { key: 'siglasInstitucion', label: 'Acrónimo / Siglas de la Institución', placeholder: 'Ej: MOPC' },
  { key: 'unidadGestion', label: 'Unidad Responsable (Gestión Adm. y Fin.)', placeholder: 'Ingrese la unidad de gestión' },
  { key: 'unidadSistemas', label: 'Unidad Responsable (Sistemas y Tec.)', placeholder: 'Ingrese la unidad de tecnología' },
  { key: 'unidadContratante', label: 'Unidad Contratante', placeholder: 'Ingrese la unidad contratante' },
  { key: 'emailContacto', label: 'Correo electrónico de contacto', placeholder: 'correo.contacto@dominio.com', keyboardType: 'email-address' },
];

// 3. Crea el esquema de validación con Yup
const validationSchema = Yup.object().shape({
  emailPrincipal: Yup.string().email('Formato de email no válido').required('Campo requerido'),
  nombreInstitucion: Yup.string().required('Campo requerido'),
  siglasInstitucion: Yup.string().required('Campo requerido'),
  unidadGestion: Yup.string().required('Campo requerido'),
  unidadSistemas: Yup.string().required('Campo requerido'),
  unidadContratante: Yup.string().required('Campo requerido'),
  emailContacto: Yup.string().email('Formato de email no válido').required('Campo requerido'),
});

// --- COMPONENTE PRINCIPAL ---

const ManualFormScreen = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [formData, setFormData] = useState<FormDataState>({
    emailPrincipal: '',
    nombreInstitucion: '',
    siglasInstitucion: '',
    unidadGestion: '',
    unidadSistemas: '',
    unidadContratante: '',
    emailContacto: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isFormValid, setIsFormValid] = useState(false);
  const [error, setError] = useState('');

  // Efecto para verificar si el usuario ya ha enviado el formulario antes
  useEffect(() => {
    const verifyStatus = async () => {
      try {
        const { hasSubmitted } = await FormService.checkSubmissionStatus();
        if (hasSubmitted) {
          Alert.alert(
            'Límite alcanzado',
            'Ya has llenado este formulario anteriormente.',
            [{ text: 'OK', onPress: () => router.back() }]
          );
        } else {
          setIsVerifying(false);
        }
      } catch (e) {
        Alert.alert('Error', 'No se pudo verificar el estado del formulario.', [{ text: 'OK', onPress: () => router.back() }]);
      }
    };
    verifyStatus();
  }, []);

  // Efecto para validar el formulario en tiempo real
  useEffect(() => {
    validationSchema.isValid(formData).then(valid => setIsFormValid(valid));
  }, [formData]);

  const handleInputChange = (name: keyof FormDataState, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;
    
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        'Dirección de correo electrónico': formData.emailPrincipal,
        'Nombre de la Institución / Ente / Órgano': formData.nombreInstitucion,
        'Acrónimo y/o siglas de la Institución / Ente / Órgano': formData.siglasInstitucion,
        'Nombre de la Unidad / Gerencia y/u Oficina responsable de la Gestión Administrativa y Financiera de la Institución / Ente / Órgano': formData.unidadGestion,
        'Nombre de la Unidad / Gerencia y/u Oficina responsable del Área de Sistema y Tecnología de la Institución / Ente / Órgano': formData.unidadSistemas,
        'Nombre de la Unidad / Gerencia y/u Oficina que cumple funciones de Unidad Contratante en la Institución / Ente / Órgano': formData.unidadContratante,
        'Correo electrónico': formData.emailContacto,
        // Campos internos (no visibles)
        'Marca temporal': new Date().toISOString(),
        'UsuarioRegistradoEmail': user?.Email || '',
        'Llenado': 'TRUE',
      };

      const result = await FormService.submitManualContrataciones(payload);
      if (result.success) {
        Alert.alert('Éxito', 'Formulario enviado correctamente.', [{ text: 'OK', onPress: () => router.back() }]);
      } else {
        setError(result.error || 'Ocurrió un error al enviar el formulario.');
      }
    } catch (e) {
      setError('Ocurrió un error inesperado al conectar con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Muestra una pantalla de carga mientras se verifica el estado
  if (isVerifying) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Verificando estado...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            {FORM_FIELDS.map(field => (
              <View key={field.key} style={styles.inputContainer}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  value={formData[field.key]}
                  onChangeText={(val) => handleInputChange(field.key, val)}
                  keyboardType={field.keyboardType || 'default'}
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="none"
                />
              </View>
            ))}
          </View>

          <View style={styles.footer}>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity
              style={[styles.button, (!isFormValid || isSubmitting) && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Enviar Formulario</Text>}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  keyboardAvoiding: { flex: 1 },
  scrollContainer: { flexGrow: 1, padding: 24, justifyContent: 'space-between' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  loadingText: { marginTop: 16, fontSize: 16, color: Colors.textSecondary },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '500', color: Colors.textSecondary, marginBottom: 8 },
  input: { height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16, fontSize: 16, color: Colors.text },
  footer: { paddingTop: 16 },
  errorText: { color: Colors.error, textAlign: 'center', marginBottom: 12, fontSize: 14 },
  button: { width: '100%', height: 56, backgroundColor: Colors.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#cccccc' },
  buttonText: { color: Colors.textLight, fontSize: 18, fontWeight: 'bold' },
});

export default ManualFormScreen;