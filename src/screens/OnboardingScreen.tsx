// src/screens/OnboardingScreen.tsx
//
// 3-step onboarding carousel with Reanimated fade/slide transitions.

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
} from 'react-native';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { db } from '../services/database';
import { COLORS } from '../constants';
import { RootStackParamList } from '../types';

const { width } = Dimensions.get('window');
type NavProp = NativeStackNavigationProp<RootStackParamList>;

const STEPS = [
  {
    emoji: '📝',
    title: 'Save your snippets',
    subtitle: 'Store addresses, bank details, links, templates — anything you type repeatedly.',
    color: COLORS.primary,
  },
  {
    emoji: '⚡️',
    title: 'Tap once to copy',
    subtitle: 'A single tap copies any snippet to your clipboard instantly. No typing. No scrolling.',
    color: '#10B981',
  },
  {
    emoji: '🗂️',
    title: 'Organise with categories',
    subtitle: 'Keep things tidy with colour-coded categories: Work, Personal, Finance and more.',
    color: '#F59E0B',
  },
];

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;

  const handleNext = async () => {
    if (isLast) {
      await db.setPreference('onboarded', 'true');
      navigation.replace('Main');
    } else {
      setStep(s => s + 1);
    }
  };

  const current = STEPS[step];

  return (
    <View style={styles.container}>
      {/* Card */}
      <Animated.View
        key={step}
        entering={FadeInRight.duration(300)}
        exiting={FadeOutLeft.duration(200)}
        style={[styles.card, { borderColor: current.color + '40' }]}
      >
        <Text style={styles.emoji}>{current.emoji}</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.subtitle}>{current.subtitle}</Text>
      </Animated.View>

      {/* Dots */}
      <View style={styles.dots}>
        {STEPS.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i === step
                ? { backgroundColor: current.color, width: 24 }
                : { backgroundColor: COLORS.border },
            ]}
          />
        ))}
      </View>

      {/* Next / Get started button */}
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: current.color }]}
        onPress={handleNext}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>{isLast ? 'Get Started' : 'Next'}</Text>
      </TouchableOpacity>

      {/* Skip */}
      {!isLast && (
        <TouchableOpacity onPress={handleNext} style={styles.skip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDE9F6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#DDD6FE',
    padding: 32,
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: { fontSize: 64, marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '800', color: '#1E1B2E', textAlign: 'center', marginBottom: 14, lineHeight: 34 },
  subtitle: { fontSize: 16, color: '#6B7280', textAlign: 'center', lineHeight: 24 },
  dots: { flexDirection: 'row', gap: 8, marginBottom: 32 },
  dot: { height: 8, borderRadius: 4, backgroundColor: '#DDD6FE' },
  btn: { width: '100%', borderRadius: 16, padding: 18, alignItems: 'center', marginBottom: 16, backgroundColor: '#7C3AED' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  skip: { padding: 8 },
  skipText: { color: '#6B7280', fontSize: 15 },
});

export default OnboardingScreen;
