const PIN_REGEX = /^\d{4,6}$/;

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export const validatePin = (pin: string): ValidationResult => {
  if (typeof pin !== 'string') {
    return { valid: false, error: 'PIN must be 4-6 digits.' };
  }

  const normalizedPin = pin.trim();
  if (!PIN_REGEX.test(normalizedPin)) {
    return { valid: false, error: 'PIN must be 4-6 digits.' };
  }

  return { valid: true };
};

export const validatePinSetup = (pin: string, confirmPin: string): ValidationResult => {
  const pinValidation = validatePin(pin);
  if (!pinValidation.valid) {
    return pinValidation;
  }

  const confirmValidation = validatePin(confirmPin);
  if (!confirmValidation.valid) {
    return confirmValidation;
  }

  if (pin.trim() !== confirmPin.trim()) {
    return { valid: false, error: 'PINs do not match.' };
  }

  return { valid: true };
};
