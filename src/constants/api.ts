export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REISSUE: '/api/auth/reissue',
    ME: '/api/auth/me'
  },
  PROJECTS: '/api/projects',
  HS_CODES: '/api/hs-codes',
  COMMERCIAL_INVOICES: '/api/commercial-invoices',
  NUTRITION_LABELS: '/api/nutrition-labels',
  COMPLIANCE: '/api/compliance',
  CHATBOT: '/api/chatbot'
} as const;

export const KAKAO_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_KAKAO_CLIENT_ID as string,
  REDIRECT_URI: import.meta.env.VITE_KAKAO_REDIRECT_URI || 'http://localhost:3000/oidc-callback'
} as const;