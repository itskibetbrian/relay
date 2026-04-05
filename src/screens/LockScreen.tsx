// src/screens/LockScreen.tsx
//
// Lock Screen — PIN entry with biometric option.
// Shows cooldown/lockout messages, handles authentication attempts.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../hooks/useAuth';
import { styles } from '../styles';

export const LockScreen: React.FC = () => {
  const {
    unlockWithPin,
    unlockWithBiometric,
    isBiometricAvailable,
    isBiometricEnabled,
    isLocked,
    lockoutTimeRemaining,
    cooldownTimeRemaining,
  } = useAuth();

  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isBiometricEnabled && !isLocked) {
      // Auto-attempt biometric on mount
      handleBiometricUnlock();
    }
  }, [isBiometricEnabled, isLocked]);

  const handlePinSubmit = async () => {
    if (pin.length < 4 || pin.length > 6) {
      Alert.alert('Invalid PIN', 'PIN must be 4-6 digits');
      return;
    }

    setIsLoading(true);
    const success = await unlockWithPin(pin);
    setIsLoading(false);

    if (!success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Incorrect PIN', 'Please try again');
      setPin('');
    } else {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleBiometricUnlock = async () => {
    setIsLoading(true);
    const success = await unlockWithBiometric();
    setIsLoading(false);

    if (!success) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const formatTime = (ms: number) => {
    const seconds = Math.ceil(ms / 1000);
    return `${seconds}s`;
  };

  if (isLocked) {
    return (
      <SafeAreaView style={styles.lockContainer}>
        <View style={styles.lockContent}>
          <Text style={styles.lockTitle}>Account Locked</Text>
          <Text style={styles.lockSubtitle}>
            Too many failed attempts. Please wait before trying again.
          </Text>
          <Text style={styles.lockMessage}>
            You can try again in {formatTime(lockoutTimeRemaining)}.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.lockContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.lockContent}
      >
        <Text style={styles.lockTitle}>Enter PIN</Text>

        <TextInput
          style={styles.pinInput}
          value={pin}
          onChangeText={setPin}
          placeholder="4-6 digits"
          keyboardType="numeric"
          secureTextEntry
          maxLength={6}
          editable={!isLoading && cooldownTimeRemaining === 0}
          onSubmitEditing={handlePinSubmit}
        />

        {cooldownTimeRemaining > 0 && (
          <Text style={styles.cooldownText}>
            Too many attempts. Try again in {formatTime(cooldownTimeRemaining)}
          </Text>
        )}

        <TouchableOpacity
          style={[styles.unlockButton, (isLoading || cooldownTimeRemaining > 0) && styles.disabledButton]}
          onPress={handlePinSubmit}
          disabled={isLoading || cooldownTimeRemaining > 0}
        >
          <Text style={styles.unlockButtonText}>
            {isLoading ? 'Unlocking...' : 'Unlock'}
          </Text>
        </TouchableOpacity>

        {isBiometricAvailable && isBiometricEnabled && (
          <TouchableOpacity
            style={[styles.biometricButton, isLoading && styles.disabledButton]}
            onPress={handleBiometricUnlock}
            disabled={isLoading}
          >
            <Text style={styles.biometricButtonText}>Use Biometric</Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
