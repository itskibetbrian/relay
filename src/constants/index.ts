// src/constants/index.ts

export const CATEGORY_COLORS = [
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#8B5CF6', // Violet
  '#EF4444', // Red
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#06B6D4', // Cyan
];

export const DEFAULT_CATEGORIES = [
  { id: 'sales', name: 'Sales', color: '#8B5CF6', icon: 'tag' },
  { id: 'support', name: 'Support', color: '#3B82F6', icon: 'tag' },
  { id: 'finance', name: 'Finance', color: '#10B981', icon: 'credit-card' },
  { id: 'marketing', name: 'Marketing', color: '#EC4899', icon: 'globe' },
  { id: 'operations', name: 'Operations', color: '#F59E0B', icon: 'briefcase' },
  { id: 'other', name: 'Other', color: '#8B5CF6', icon: 'tag' },
];

export const FREE_TIER_LIMIT = 10;

export const MESSAGE_TEMPLATES = [
  {
    id: 'sales-follow-up',
    title: 'Quote Follow-up',
    content: "Hi! Just checking in on the quote I sent over. I'm happy to answer any questions or adjust the options if needed.",
    categoryId: 'sales',
  },
  {
    id: 'sales-payment-reminder',
    title: 'Payment Reminder',
    content: 'Hi! This is a friendly reminder that your payment is still pending. Please let me know once it has been sent, or if you need the payment details again.',
    categoryId: 'sales',
  },
  {
    id: 'support-reply',
    title: 'Support Reply',
    content: "Thanks for reaching out. I've received your message and will look into this right away. I'll update you as soon as I have more information.",
    categoryId: 'support',
  },
  {
    id: 'operations-delivery-update',
    title: 'Delivery Update',
    content: 'Hi! Your order is being processed and we will share the delivery update as soon as it is ready. Thanks for your patience.',
    categoryId: 'operations',
  },
  {
    id: 'finance-payment-confirmed',
    title: 'Payment Confirmed',
    content: 'Payment received, thank you. We have updated your order and will proceed with the next step.',
    categoryId: 'finance',
  },
  {
    id: 'marketing-appointment-confirmation',
    title: 'Appointment Confirmation',
    content: 'Hi! Confirming your appointment for the agreed time. Please reply if anything changes before then.',
    categoryId: 'marketing',
  },
];

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 250,
  slow: 400,
};

export const TAB_TRANSITION_CONFIG = {
  duration: ANIMATION_DURATION.normal,
};
