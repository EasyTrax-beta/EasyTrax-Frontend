import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS, KAKAO_CONFIG } from '../constants/api';
import type { ApiResponse, LoginResponse, UserInfo } from '../types';

class AuthService {
  private baseURL: string;
  private refreshPromise: Promise<ApiResponse<LoginResponse> | undefined> | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    axios.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.debug(`API 요청: ${config.method?.toUpperCase()} ${config.url}`, { authenticated: true });
      } else {
        console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url} (토큰 없음)`);
      }
      return config;
    });

    axios.interceptors.response.use(
      (response) => {
        console.log(`API 응답 성공: ${response.config.method?.toUpperCase()} ${response.config.url} (${response.status})`);
        return response;
      },
      async (error) => {
        console.error(`API 응답 오류: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        });

        if (!error.config) {
          return Promise.reject(error);
        }

        const originalRequest = error.config as typeof error.config & { __isRetryRequest?: boolean };
        const { response } = error;
        const isAuthEndpoint =
          originalRequest.url &&
          [API_ENDPOINTS.AUTH.REISSUE, API_ENDPOINTS.AUTH.LOGOUT, API_ENDPOINTS.AUTH.LOGIN].some((endpoint) =>
            originalRequest.url.includes(endpoint)
          );

        if (response?.status === 401 && !isAuthEndpoint && !originalRequest.__isRetryRequest) {
          console.log('401 오류 감지, 토큰 재발급 시도');
          originalRequest.__isRetryRequest = true;

          if (!this.refreshPromise) {
            this.refreshPromise = this.refreshToken().finally(() => {
              this.refreshPromise = null;
            });
          }

          try {
            await this.refreshPromise;
            console.log('토큰 재발급 성공, 원래 요청 재시도');
            return axios.request(originalRequest);
          } catch (refreshError) {
            console.error('토큰 재발급 실패:', refreshError);
            return Promise.reject(error);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  private initKakao(): boolean {
    if (!window.Kakao) {
      console.error('Kakao SDK not loaded');
      return false;
    }
    
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(KAKAO_CONFIG.CLIENT_ID);
    }
    return true;
  }

  async loginWithKakao(): Promise<void> {
    const isInitialized = this.initKakao();
    
    if (!isInitialized || !window.Kakao || !window.Kakao.Auth) {
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
      console.debug('카카오 토큰 응답 수신', { hasIdToken: !!tokenData.id_token });
      
      if (!tokenResponse.ok) {
        throw new Error(`카카오 토큰 요청 실패: ${tokenData.error_description || tokenData.error || 'Unknown error'}`);
      }
      
      if (!tokenData.id_token) {
        console.warn('ID 토큰이 비어 있습니다.', { hasIdToken: false, error: tokenData.error });
        throw new Error('ID 토큰을 받지 못했습니다. OpenID Connect 스코프가 필요합니다.');
      }

      console.debug('백엔드 로그인 시도');

      // 백엔드 로그인 처리
      const response = await axios.post(`${this.baseURL}${API_ENDPOINTS.AUTH.LOGIN}`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'id_token': tokenData.id_token
        }
      });

      console.debug('백엔드 로그인 응답 수신');

      if (response.data.success) {
        const { accessToken, refreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        console.debug('토큰 저장 완료');
        return response.data;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('OIDC callback error:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          headers: error.response?.headers
        });
      }
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

      console.debug('토큰 재발급 시도', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken
      });

      if (!accessToken || !refreshToken) {
        throw new Error('토큰이 없습니다');
      }

      const response = await axios.post(`${this.baseURL}${API_ENDPOINTS.AUTH.REISSUE}`, null, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'RefreshToken': `Bearer ${refreshToken}`
        }
      });

      console.debug('토큰 재발급 응답 수신');

      if (response.data.success) {
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        console.debug('새 토큰 저장 완료');
        return response.data;
      } else {
        throw new Error(response.data.message || '토큰 재발급 실패');
      }
    } catch (error) {
      console.error('토큰 재발급 오류:', error);
      await this.logout();
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