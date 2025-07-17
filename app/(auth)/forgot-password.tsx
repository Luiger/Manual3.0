// app/(auth)/forgot-password.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

// Componente para el indicador de pasos
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
    const steps = ['Enviar correo', 'Código', 'Recuperar Contraseña'];
    return (
      <View style={styles.stepperContainer}>
        {steps.map((label, index) => (
          <React.Fragment key={index}>
            <View style={styles.step}>
              <View style={[styles.stepCircle, currentStep >= index + 1 && styles.stepCircleActive]}>
                <Text style={[styles.stepText, currentStep >= index + 1 && styles.stepTextActive]}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepLabel, currentStep >= index + 1 && styles.stepLabelActive]}>{label}</Text>
            </View>
            {index < steps.length - 1 && <View style={styles.stepperLine} />}
          </React.Fragment>
        ))}
      </View>
    );
};

export default function ForgotPasswordScreen() {
    const router = useRouter();
    // Estado para controlar el paso actual del flujo
    const [step, setStep] = useState(1);
    
    // Estados para los datos del formulario
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // --- Renderizado Condicional de Vistas ---
    
    // Vista para el Paso 1: Ingresar Correo
    const renderStep1 = () => (
        <>
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <Text style={styles.subtitle}>Ingresa el correo electrónico asociado a tu cuenta.</Text>
            <StepIndicator currentStep={1} />
            <TextInput style={styles.input} placeholder="Ingresa tu correo" value={email} onChangeText={setEmail} keyboardType="email-address"/>
            <TouchableOpacity style={styles.button} onPress={() => { console.log('Enviando código a', email); setStep(2); }}>
                <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
        </>
    );

    // Vista para el Paso 2: Verificar Código
    const renderStep2 = () => (
        <>
            <Text style={styles.title}>Verificar Código</Text>
            <Text style={styles.subtitle}>Hemos enviado un código a {'\n'}{email}</Text>
            <StepIndicator currentStep={2} />
            <TextInput style={styles.input} placeholder="123456" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} />
            <TouchableOpacity style={styles.button} onPress={() => { console.log('Verificando código', code); setStep(3); }}>
                <Text style={styles.buttonText}>Verificar</Text>
            </TouchableOpacity>
        </>
    );

    // Vista para el Paso 3: Nueva Contraseña
    const renderStep3 = () => (
        <>
            <Text style={styles.title}>Establecer Nueva Contraseña</Text>
            <Text style={styles.subtitle}>Tu nueva contraseña debe ser segura.</Text>
            <StepIndicator currentStep={3} />
            <TextInput style={styles.input} placeholder="Mínimo 8 caracteres" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
            <TextInput style={[styles.input, {marginTop: 16}]} placeholder="Confirma tu nueva contraseña" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
            <TouchableOpacity style={styles.button} onPress={() => { console.log('Contraseña actualizada'); router.replace('/(auth)/login'); }}>
                <Text style={styles.buttonText}>Actualizar Contraseña</Text>
            </TouchableOpacity>
        </>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <TouchableOpacity onPress={() => step === 1 ? router.back() : setStep(step - 1)} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>

                {/* Renderiza la vista correspondiente al paso actual */}
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </View>
        </SafeAreaView>
    );
}

// Estilos
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.background },
    container: { flex: 1, padding: 24, paddingTop: 80, alignItems: 'center' },
    backButton: { position: 'absolute', top: 50, left: 24, zIndex: 1, padding: 8 },
    title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, textAlign: 'center', marginBottom: 8 },
    subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: 32 },
    stepperContainer: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center', marginBottom: 32, width: '100%' },
    step: { alignItems: 'center', flex: 1 },
    stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
    stepCircleActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
    stepText: { color: Colors.textSecondary, fontWeight: 'bold' },
    stepTextActive: { color: Colors.textLight },
    stepLabel: { marginTop: 8, color: Colors.textSecondary, fontSize: 12, textAlign: 'center' },
    stepLabelActive: { color: Colors.primary, fontWeight: 'bold' },
    stepperLine: { flex: 1, height: 2, backgroundColor: Colors.border, marginTop: 15 },
    input: { width: '100%', height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
    button: { width: '100%', backgroundColor: Colors.primary, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
    buttonText: { color: Colors.textLight, fontSize: 18, fontWeight: 'bold' },
});