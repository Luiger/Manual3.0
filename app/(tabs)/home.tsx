// app/(tabs)/home.tsx
import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../constants/Colors';

// Datos de ejemplo para las tarjetas. En una app real, esto vendría de una API.
const DUMMY_DATA = [
  { id: '1', title: 'Manual Contrataciones', description: 'Manual de Contrataciones Públicas', hashtag: '#UniversitasLegal', actionText: 'Manual Contrataciones' },
  { id: '2', title: 'Manual Sheet', description: 'Manual de Contrataciones Públicas', hashtag: '#UniversitasLegal', actionText: 'Manual Sheet' },
  { id: '3', title: 'Repositorio Universitas Legal', description: 'Conoce más de Universitas', hashtag: '#UniversitasLegal', actionText: 'Repositorio Legal' },
  { id: '4', title: 'Repositorio Universitas Legal', description: 'Conoce más de Universitas', hashtag: '#UniversitasLegal', actionText: 'Repositorio Legal' },
  { id: '5', title: 'Manual Contrataciones', description: 'Manual de Contrataciones Públicas', hashtag: '#UniversitasLegal', actionText: 'Manual Contrataciones' },
  { id: '6', title: 'Repositorio Universitas Legal', description: 'Conoce más de Universitas', hashtag: '#UniversitasLegal', actionText: 'Repositorio Legal' },
];

// Componente para renderizar cada tarjeta en la cuadrícula
const ManualCard = ({ item, onPress }: { item: typeof DUMMY_DATA[0], onPress: () => void }) => (
    <View style={styles.cardContainer}>
        <View style={styles.cardBlueSection}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardHashtag}>{item.hashtag}</Text>
        </View>
        <TouchableOpacity style={styles.cardWhiteSection} onPress={onPress}>
            <Text style={styles.cardActionText}>{item.actionText}</Text>
        </TouchableOpacity>
    </View>
);


export default function HomeScreen() {
  const router = useRouter();

  // Navega al formulario del manual cuando se presiona una tarjeta
  const handleCardPress = (item: typeof DUMMY_DATA[0]) => {
    console.log('Abriendo manual:', item.title);
    router.push('/manual-form');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header Personalizado */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.push('/(profile)/menu')}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>LS</Text>
                </View>
            </TouchableOpacity>
            <Image source={require('../../assets/images/logo.png')} style={styles.headerLogo} resizeMode='contain' />
            <Text style={styles.headerTitle}>Manuales de Contrataciones</Text>
        </View>

        {/* Cuadrícula de tarjetas */}
        <FlatList
            data={DUMMY_DATA}
            renderItem={({ item }) => <ManualCard item={item} onPress={() => handleCardPress(item)} />}
            keyExtractor={(item) => item.id}
            numColumns={2} // Define la cuadrícula de 2 columnas
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
}

// Estilos para la pantalla de Home
const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: Colors.surface },
    container: { flex: 1 },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: Colors.background,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: Colors.textLight,
        fontWeight: 'bold',
        fontSize: 16,
    },
    headerLogo: {
        width: 24,
        height: 24,
        marginLeft: 12,
    },
    headerTitle: {
        marginLeft: 8,
        fontSize: 18,
        fontWeight: '600',
        color: Colors.text,
    },
    // Lista
    listContainer: {
        padding: 8,
    },
    // Tarjeta
    cardContainer: {
        flex: 1,
        margin: 8,
        borderRadius: 12,
        backgroundColor: Colors.background,
        elevation: 3, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        overflow: 'hidden', // Asegura que el contenido respete el borde redondeado
    },
    cardBlueSection: {
        backgroundColor: Colors.primary,
        padding: 16,
        minHeight: 150, // Altura mínima para consistencia
    },
    cardTitle: {
        color: Colors.textLight,
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardDescription: {
        color: Colors.textLight,
        fontSize: 14,
        marginBottom: 12,
    },
    cardHashtag: {
        color: Colors.textLight,
        fontSize: 12,
        opacity: 0.8,
    },
    cardWhiteSection: {
        backgroundColor: Colors.background,
        padding: 16,
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    cardActionText: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: '600',
    },
});