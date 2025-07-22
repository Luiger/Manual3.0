import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, ScrollView,
  TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Yup from 'yup';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { FormService } from '../services/form.service';
import Colors from '../constants/Colors';

// Esquema de validación actualizado
const validationSchema = Yup.object().shape({
  // Este campo es opcional, pero si se escribe, debe tener formato de email.
  emailPrincipal: Yup.string().email('Formato de email no válido'),
  // El resto de los campos siguen siendo obligatorios.
  nombreInstitucion: Yup.string().required('Campo requerido'),
  siglasInstitucion: Yup.string().required('Campo requerido'),
  unidadGestion: Yup.string().required('Campo requerido'),
  unidadSistemas: Yup.string().required('Campo requerido'),
  unidadContratante: Yup.string().required('Campo requerido'),
  emailAdicional: Yup.string().email('Formato de email no válido'),
});

const ManualProFormScreen = () => {
  const router = useRouter();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    emailPrincipal: '',
    nombreInstitucion: '',
    siglasInstitucion: '',
    unidadGestion: '',
    unidadSistemas: '',
    unidadContratante: '',
    emailAdicional: ''
  });
  
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Lógica de validación en tiempo real
  useEffect(() => {
    validationSchema.isValid(formData).then(valid => setIsFormValid(valid));
  }, [formData]);

  const handleInputChange = (name: keyof typeof formData, value: string) => {
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    setError('');

    try {
        const payload = {
            'Dirección de correo electrónico': formData.emailPrincipal,
            'Nombre de la Institución / Ente / Órgano': formData.nombreInstitucion,
            'Acrónimo y/o siglas de la Institución / Ente / Órgano': formData.siglasInstitucion,
            'Nombre de la Unidad / Gerencia y/u Oficina responsable de la Gestión Administrativa y Financiera de la Institución / Ente / Órgano': formData.unidadGestion,
            'Nombre de la Unidad / Gerencia y/u Oficina responsable del Área de Sistema y Tecnología de la Institución / Ente / Órgano': formData.unidadSistemas,
            'Nombre de la Unidad / Gerencia y/u Oficina que cumple funciones de Unidad Contratante en la Institución / Ente / Órgano': formData.unidadContratante,
            'Correo electrónico': formData.emailAdicional,
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

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Elabora tu manual PRO</Text>
            <Text style={styles.subtitle}>Completa los siguientes campos para generar la base de tu manual. Una vez elaborado, lo recibirás en tu correo en formato de Google Docs, listo para que lo personalices.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Dirección de correo electrónico (Opcional)</Text>
            <TextInput
              style={styles.input}
              value={formData.emailPrincipal}
              onChangeText={(val) => handleInputChange('emailPrincipal', val)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>1. Indique el nombre de la institución, ente u órgano.</Text>
            <TextInput style={styles.input} value={formData.nombreInstitucion} onChangeText={(val) => handleInputChange('nombreInstitucion', val)} />
            <Text style={styles.legalRef}>Referencia legal: Art. 18.2 LOPA.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>2. Indique el acrónimo y/o siglas de la institución.</Text>
            <TextInput style={styles.input} value={formData.siglasInstitucion} onChangeText={(val) => handleInputChange('siglasInstitucion', val)} />
            <Text style={styles.legalRef}>Referencia legal: Art. 18.2 LOPA.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>3. Indique el nombre de la unidad responsable de la gestión administrativa y financiera.</Text>
            <TextInput style={styles.input} value={formData.unidadGestion} onChangeText={(val) => handleInputChange('unidadGestion', val)} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>4. Indique el nombre de la unidad responsable del área de sistema y tecnología.</Text>
            <TextInput style={styles.input} value={formData.unidadSistemas} onChangeText={(val) => handleInputChange('unidadSistemas', val)} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>5. Indique el nombre de la unidad que cumple funciones de unidad contratante.</Text>
            <TextInput style={styles.input} value={formData.unidadContratante} onChangeText={(val) => handleInputChange('unidadContratante', val)} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>¿A qué otra dirección de correo electrónico deseas que enviemos el manual? (Opcional)</Text>
            <TextInput 
              style={styles.input} 
              value={formData.emailAdicional} 
              onChangeText={(val) => handleInputChange('emailAdicional', val)} 
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="none"
            />
          </View>

          <View style={styles.warningBox}>
            <Feather name="alert-triangle" size={20} color={Colors.textSecondary} />
            <Text style={styles.warningText}>Asegúrate de la dirección de correo ingresada. Eres responsable del acceso que compartes a este documento.</Text>
          </View>
          
          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity 
            style={[styles.button, !isFormValid && styles.buttonDisabled, styles.buttonPro]} 
            onPress={handleSubmit}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? <ActivityIndicator color={Colors.textLight} /> : <Text style={styles.buttonTextPro}>Elaborar manual</Text>}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  container: { padding: 24, paddingBottom: 48 },
  header: { marginBottom: 32, alignItems: 'center' },
  title: { fontFamily: 'Roboto_700Bold', fontSize: 22, color: Colors.text, textAlign: 'center' },
  subtitle: { fontFamily: 'Roboto_400Regular', fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginTop: 12, lineHeight: 22 },
  inputGroup: { marginBottom: 24 },
  label: { fontFamily: 'Roboto_500Medium', fontSize: 16, color: Colors.text, marginBottom: 8, lineHeight: 22 },
  input: {
    height: 56, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border,
    borderRadius: 8, paddingHorizontal: 16, fontSize: 16, fontFamily: 'Roboto_400Regular'
  },
  legalRef: { fontFamily: 'Roboto_400Regular', fontSize: 12, color: Colors.textSecondary, marginTop: 4, fontStyle: 'italic' },
  warningBox: { flexDirection: 'row', backgroundColor: Colors.accentExpress, padding: 12, borderRadius: 8, alignItems: 'center', gap: 10, marginTop: 16 },
  warningText: { fontFamily: 'Roboto_400Regular', color: Colors.textSecondary, fontSize: 13, flex: 1, lineHeight: 18 },
  button: {
    width: '100%', height: 56, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center', marginTop: 16,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc'
  },
  buttonPro: { backgroundColor: Colors.accentPRO },
  buttonTextPro: { fontFamily: 'Roboto_500Medium', color: Colors.textLight, fontSize: 16 },
  errorText: { color: Colors.error, textAlign: 'center', marginBottom: 16, fontFamily: 'Roboto_400Regular' },
});

export default ManualProFormScreen;