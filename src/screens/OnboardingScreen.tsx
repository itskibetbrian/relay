// src/screens/OnboardingScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Check } from 'lucide-react-native';
import { db } from '../services/database';
import { RootStackParamList } from '../types';
import { useTheme } from '../hooks/useTheme';
import { ANIMATION_DURATION } from '../constants';
import { textFont } from '../constants/typography';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [acceptedToS, setAcceptedToS] = useState(false);

  const steps = [
    {
      title: 'Save what you reuse',
      subtitle: 'Keep addresses, links, templates, invoice details, and other repeat text ready to copy.',
      accent: theme.primary,
      body: null,
    },
    {
      title: 'Quick category guide',
      subtitle: 'A simple way to sort your snippets from day one.',
      accent: theme.success,
      body: (
        <View style={styles.guideList}>
          <Text style={[styles.guideLine, { color: theme.text }]}>Finance: IBAN or bank account details, PayPal or payment links, tax numbers, invoice details.</Text>
          <Text style={[styles.guideLine, { color: theme.text }]}>Work: work email, company address, Zoom or Meet links, templates, signatures.</Text>
          <Text style={[styles.guideLine, { color: theme.text }]}>Other: anything that does not fit the categories above.</Text>
        </View>
      ),
    },
    {
      title: 'Terms of Service',
      subtitle: 'By using Qoppy, you agree to our terms of service and privacy policy.',
      accent: theme.primary,
      body: (
        <View style={styles.guideList}>
          <Text style={[styles.guideLine, { color: theme.text }]}>1. Use the app for storing non-sensitive snippets only.</Text>
          <Text style={[styles.guideLine, { color: theme.text }]}>2. Your data is stored locally. Cloud sync requires a premium subscription.</Text>
          <Text style={[styles.guideLine, { color: theme.text }]}>3. We do not sell your personal data or clipboard content.</Text>
          <Text style={[styles.guideLine, { color: theme.text }]}>4. You can export or delete your data at any time from Settings.</Text>
        </View>
      ),
    },
  ];

  const isLast = step === steps.length - 1;
  const current = steps[step];

  const handleNext = async () => {
    if (isLast) {
      if (!acceptedToS) return;
      await db.setPreference('onboarded', 'true');
      navigation.replace('Main');
      return;
    }

    setStep(prev => prev + 1);
  };

  const handleSkip = () => {
    setStep(steps.length - 1);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View
        key={step}
        entering={FadeInRight.duration(ANIMATION_DURATION.normal)}
        exiting={FadeOutLeft.duration(ANIMATION_DURATION.fast)}
        style={[styles.card, { backgroundColor: theme.surface, borderColor: current.accent }]}
      >
        <View style={[styles.accent, { backgroundColor: current.accent }]} />
        <Text style={[styles.title, { color: theme.text }]}>{current.title}</Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{current.subtitle}</Text>
        {current.body}

        {isLast && (
          <TouchableOpacity
            style={styles.tosRow}
            onPress={() => setAcceptedToS(!acceptedToS)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, { borderColor: theme.border }, acceptedToS && { backgroundColor: theme.primary, borderColor: theme.primary }]}>
              {acceptedToS && <Check size={14} color={theme.onPrimary} strokeWidth={3} />}
            </View>
            <Text style={[styles.tosText, { color: theme.text }]}>I accept the Terms of Service</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      <View style={styles.dots}>
        {steps.map((item, index) => (
          <View
            key={item.title}
            style={[
              styles.dot,
              {
                backgroundColor: index === step ? current.accent : theme.border,
                width: index === step ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.btn, { backgroundColor: current.accent }, isLast && !acceptedToS && { opacity: 0.5 }]}
        onPress={handleNext}
        disabled={isLast && !acceptedToS}
        activeOpacity={0.85}
      >
        <Text style={[styles.btnText, { color: theme.onPrimary }]}>{isLast ? 'Get Started' : 'Next'}</Text>
      </TouchableOpacity>

      {!isLast && (
        <TouchableOpacity onPress={handleSkip} style={styles.skip}>
          <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    borderWidth: 1.5,
    padding: 24,
    marginBottom: 32,
  },
  accent: {
    width: 54,
    height: 6,
    borderRadius: 999,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    ...textFont('extrabold'),
    marginBottom: 12,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 18,
  },
  guideList: {
    gap: 12,
  },
  guideLine: {
    fontSize: 14,
    lineHeight: 21,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 28,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  btn: {
    width: '100%',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginBottom: 16,
  },
  btnText: {
    fontSize: 17,
    ...textFont('bold'),
  },
  skip: {
    padding: 8,
  },
  skipText: {
    fontSize: 15,
  },
  tosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#00000010',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tosText: {
    fontSize: 15,
    ...textFont('medium'),
  },
});

export default OnboardingScreen;
