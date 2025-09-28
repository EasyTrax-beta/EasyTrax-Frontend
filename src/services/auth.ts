import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, KAKAO_CONFIG } from '../constants/api';
import type { ApiResponse, LoginResponse, UserInfo } from '../types';

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (!error.config) {
          return Promise.reject(error);
        }

        const originalRequest = error.config as typeof error.config & { __isRetryRequest?: boolean };
        const { response } = error;
        const isAuthEndpoint =
          originalRequest.url &&
          [API_ENDPOINTS.AUTH.REISSUE, API_ENDPOINTS.AUTH.LOGOUT].some((endpoint) =>
            originalRequest.url.includes(endpoint)
          );

        if (response?.status === 401 && !isAuthEndpoint && !originalRequest.__isRetryRequest) {
          originalRequest.__isRetryRequest = true;
          await this.refreshToken();
          return axios.request(originalRequest);
        }

        return Promise.reject(error);
      }
    );
  }

  private initKakao(): void {
    if (!window.Kakao) {
      console.error('Kakao SDK not loaded');
      return;
    }
    
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_CONFIG.CLIENT_ID);
    }
  }

  async loginWithKakao(): Promise<void> {
    this.initKakao();

    if (!window.Kakao || !window.Kakao.Auth) {
      throw new Error('Kakao SDK가 초기화되지 않았습니다.');
    }
    
    // OIDC 로그인 사용 (리다이렉트 방식)
    window.Kakao.Auth.authorize({
      redirectUri: KAKAO_CONFIG.REDIRECT_URI,
      scope: 'openid,profile_nickname,profile_image,account_email'
    });
  }

  async handleOidcCallback(code: string): Promise<ApiResponse<LoginResponse>> {
    try {
      // 카카오에서 토큰 가져오기
      const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: KAKAO_CONFIG.CLIENT_ID,
          redirect_uri: KAKAO_CONFIG.REDIRECT_URI,
          code: code,
        }),
      });

      const tokenData = await tokenResponse.json();
      
      if (!tokenData.id_token) {
        throw new Error('ID 토큰을 받지 못했습니다.');
      }

      // 백엔드 로그인 처리
      const response = await axios.post(`${this.baseURL}${API_ENDPOINTS.AUTH.LOGIN}`, null, {
        headers: {
          'id_token': tokenData.id_token
        }
      });

      if (response.data.success) {
        const { accessToken, refreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('OIDC callback error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await axios.post(`${this.baseURL}${API_ENDPOINTS.AUTH.LOGOUT}`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      if (window.Kakao && window.Kakao.Auth) {
        window.Kakao.Auth.logout();
      }
    }
  }

  async refreshToken(): Promise<ApiResponse<LoginResponse> | undefined> {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      const response = await axios.post(`${this.baseURL}${API_ENDPOINTS.AUTH.REISSUE}`, null, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'RefreshToken': `Bearer ${refreshToken}`
        }
      });

      if (response.data.success) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        return response.data;
      }
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  async getMe(): Promise<ApiResponse<UserInfo>> {
    const response = await axios.get(`${this.baseURL}${API_ENDPOINTS.AUTH.ME}`);
    return response.data;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}

export default new AuthService();