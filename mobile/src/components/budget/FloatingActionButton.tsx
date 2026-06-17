import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';
import {AppText} from '@/components/AppText';
import Ionicons from '@expo/vector-icons/Ionicons';

interface FloatingActionButtonProps {
  onPlusPress: () => void;
  onMicPress: () => void;
}

export function FloatingActionButton({
  onPlusPress,
  onMicPress,
}: FloatingActionButtonProps) {
  return (
    <View style={styles.container}>
      {/* Microphone Button */}
      <Pressable
        style={({pressed}) => [
          styles.fabButton,
          styles.micButton,
          pressed && styles.fabPressed,
        ]}
        onPress={onMicPress}
      >
        <Ionicons name="mic" size={24} color="#FFFFFF" />
      </Pressable>

      {/* Create Button */}
      <Pressable
        style={({pressed}) => [
          styles.fabButton,
          styles.createButton,
          pressed && styles.fabPressed,
        ]}
        onPress={onPlusPress}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    right: 16,
    gap: 12,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  micButton: {
    backgroundColor: '#8B5CF6',
  },
  createButton: {
    backgroundColor: '#3B82F6',
  },
  fabIcon: {
    fontSize: 24,
  },
  fabPressed: {
    opacity: 0.8,
    transform: [{scale: 0.95}],
  },
});
