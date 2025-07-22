import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

// ✅ 1. CREAMOS NUESTRO COMPONENTE DE BARRA DE PESTAÑAS PERSONALIZADO
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    // SafeAreaView para respetar los bordes inferiores
    <SafeAreaView edges={['bottom']} style={{ backgroundColor: Colors.primary }}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Define el ícono y el color según la pestaña y si está activa
          let iconName;
          let tabStyle;
          let textColor;

          if (route.name === 'home') {
            iconName = isFocused ? 'home' : 'home-outline';
            tabStyle = styles.tabLeft;
            textColor = isFocused ? Colors.primary : Colors.textSecondary;
          } else if (route.name === 'assistant') {
            iconName = isFocused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
            tabStyle = styles.tabRight;
            textColor = Colors.textLight;
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[styles.tabButton, tabStyle]}
            >
              <Ionicons name={iconName} size={24} color={textColor} />
              <Text style={[styles.tabLabel, { color: textColor }]}>
                {options.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

// --- LAYOUT PRINCIPAL DE LAS PESTAÑAS ---
export default function TabsLayout() {
  return (
    // ✅ 2. USAMOS LA PROPIEDAD 'tabBar' PARA RENDERIZAR NUESTRO COMPONENTE PERSONALIZADO
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      {/* ✅ 3. DEFINIMOS LAS DOS PANTALLAS DE LA BARRA DE PESTAÑAS */}
      <Tabs.Screen
        name="home"
        options={{ title: 'Inicio' }}
      />
      <Tabs.Screen
        name="assistant"
        options={{ title: 'Asistente IA' }}
      />
    </Tabs>
  );
}

// ✅ 4. ESTILOS PARA LA BARRA DE PESTAÑAS PERSONALIZADA
const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    height: 60,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLeft: {
    backgroundColor: Colors.background,
  },
  tabRight: {
    backgroundColor: Colors.primary,
  },
  tabLabel: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 12,
    marginTop: 4,
  },
});