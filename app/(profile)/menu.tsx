// app/(profile)/menu.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

// Componente para los ítems del menú, para no repetir código
const MenuItem = ({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) => (
  <Link href={href} asChild>
    <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemContent}>
            {icon}
            <Text style={styles.menuItemText}>{text}</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={Colors.textSecondary} />
    </TouchableOpacity>
  </Link>
);

export default function ProfileMenuScreen() {
    const router = useRouter();

    const handleLogout = () => {
        // En una app real, aquí limpiarías el token de autenticación.
        console.log('Cerrando sesión...');
        router.replace('/(auth)/login'); // 'replace' para que el usuario no pueda volver atrás
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {/* Header personalizado */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                </View>

                {/* Contenido principal */}
                <View style={styles.mainContent}>
                    {/* Sección de información del usuario */}
                    <View style={styles.userInfoSection}>
                        <View style={styles.avatar}><Text style={styles.avatarText}>LS</Text></View>
                        <Text style={styles.userName}>Luiger Santana</Text>
                        <Text style={styles.userAccountType}>Cuenta Personal</Text>
                    </View>

                    {/* Menú de opciones */}
                    <View style={styles.menuSection}>
                        <MenuItem 
                            href="/(profile)/edit" 
                            icon={<Feather name="edit-3" size={22} color={Colors.textSecondary} />} 
                            text="Editar Perfil" 
                        />
                        <MenuItem 
                            href="/(profile)/change-password" 
                            icon={<Feather name="key" size={22} color={Colors.textSecondary} />} 
                            text="Cambiar Contraseña" 
                        />
                    </View>
                </View>

                {/* Botón de cerrar sesión */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color={Colors.error} />
                    <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

// Estilos
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.background },
    container: { flex: 1, padding: 24, justifyContent: 'space-between' },
    header: { position: 'absolute', top: 50, left: 16 },
    backButton: { padding: 8 },
    mainContent: { flex: 1, marginTop: 80 },
    userInfoSection: { alignItems: 'center', marginBottom: 48 },
    avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    avatarText: { color: Colors.textLight, fontSize: 32, fontWeight: 'bold' },
    userName: { fontSize: 22, fontWeight: 'bold', color: Colors.text },
    userAccountType: { fontSize: 16, color: Colors.textSecondary, marginTop: 4 },
    menuSection: { gap: 8 },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.border },
    menuItemContent: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    menuItemText: { fontSize: 16, color: Colors.text },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
    logoutButtonText: { color: Colors.error, fontSize: 16, fontWeight: '600' },
});