import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

const AssistantScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Asistente IA</Text>
      <Text style={styles.subtitle}>Próximamente...</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Roboto_700Bold',
    fontSize: 24,
    color: Colors.text,
  },
  subtitle: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
  }
});

export default AssistantScreen;