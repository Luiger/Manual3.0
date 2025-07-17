// app/manual-form.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../constants/Colors';

export default function ManualFormScreen() {
    const router = useRouter();
    
    // Un estado para cada campo del formulario
    const [fields, setFields] = useState({
        email: '',
        institutionName: '',
        acronym: '',
        adminUnit: '',
        techUnit: '',
        contractingUnit: '',
        contactEmail: '',
    });

    // Función para actualizar el estado de los campos
    const handleInputChange = (name: keyof typeof fields, value: string) => {
        setFields(prev => ({ ...prev, [name]: value }));
    };

    // Función para enviar el formulario
    const handleSubmit = () => {
        // Validación simple
        if (!fields.email || !fields.institutionName) {
            Alert.alert('Error', 'Correo electrónico y Nombre de la Institución son obligatorios.');
            return;
        }
        console.log('Enviando formulario:', fields);
        Alert.alert('Formulario Enviado', 'Gracias por completar el manual.', [
            { text: 'OK', onPress: () => router.back() } // Vuelve a la pantalla anterior
        ]);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.form}>
                    {/* Cada grupo es un Label + Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Dirección de correo electrónico</Text>
                        <TextInput style={styles.input} value={fields.email} onChangeText={(val) => handleInputChange('email', val)} placeholder="correo@institucion.com" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nombre de la Institución / Ente / Órgano</Text>
                        <TextInput style={styles.input} value={fields.institutionName} onChangeText={(val) => handleInputChange('institutionName', val)} placeholder="Ingrese el nombre completo" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Acrónimo / Siglas de la Institución</Text>
                        <TextInput style={styles.input} value={fields.acronym} onChangeText={(val) => handleInputChange('acronym', val)} placeholder="Ej: MOPC" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Unidad Responsable (Gestión Adm. y Fin.)</Text>
                        <TextInput style={styles.input} value={fields.adminUnit} onChangeText={(val) => handleInputChange('adminUnit', val)} placeholder="Ingrese la unidad de gestión" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Unidad Responsable (Sistemas y Tec.)</Text>
                        <TextInput style={styles.input} value={fields.techUnit} onChangeText={(val) => handleInputChange('techUnit', val)} placeholder="Ingrese la unidad de tecnología" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Unidad Contratante</Text>
                        <TextInput style={styles.input} value={fields.contractingUnit} onChangeText={(val) => handleInputChange('contractingUnit', val)} placeholder="Ingrese la unidad contratante" />
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Correo electrónico de contacto</Text>
                        <TextInput style={styles.input} value={fields.contactEmail} onChangeText={(val) => handleInputChange('contactEmail', val)} placeholder="correo.contacto@dominio.com" />
                    </View>
                </View>

                {/* Botón de envío */}
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Enviar Formulario</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

// Estilos para el formulario
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.background },
    container: { padding: 24 },
    form: { width: '100%', gap: 20 },
    inputGroup: {},
    label: { fontSize: 16, color: Colors.textSecondary, marginBottom: 8 },
    input: { height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, paddingHorizontal: 16, fontSize: 16 },
    button: { width: '100%', backgroundColor: Colors.primary, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
    buttonText: { color: Colors.textLight, fontSize: 18, fontWeight: 'bold' },
});