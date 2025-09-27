import { useState, useEffect, useCallback } from 'react';
import authService from '../services/auth';
import { getErrorMessage, getOriginalErrorMessage } from '../utils/errorMessages';
import type { UserInfo } from '../types';

export const useAuth = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkAuthStatus = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      const originalError = getOriginalErrorMessage(error);
      console.error('Auth check error:', originalError);
      setError(getErrorMessage(error));
      
      // 인증 에러인 경우 로그아웃 처리
      if (originalError.includes('401') || originalError.includes('Unauthorized')) {
        await authService.logout();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.loginWithKakao();
      // loginWithKakao redirects, so we don't handle response here
    } catch (error) {
      const userMessage = getErrorMessage(error);
      const originalError = getOriginalErrorMessage(error);
      
      console.error('Login error:', originalError);
      setError(userMessage);
      throw new Error(userMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await authService.logout();
      setUser(null);
    } catch (error) {
      const userMessage = getErrorMessage(error);
      const originalError = getOriginalErrorMessage(error);
      
      console.error('Logout error:', originalError);
      setError(userMessage);
      
      // 로그아웃은 실패해도 로컬 상태는 초기화
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
};