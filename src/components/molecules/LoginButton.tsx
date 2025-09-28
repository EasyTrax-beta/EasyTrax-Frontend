import React, { memo, useCallback } from 'react';
import Button from '../atoms/Button';
import { useAuth } from '../../hooks/useAuth';

const KakaoIconComponent: React.FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M10 2C5.58172 2 2 4.89827 2 8.5C2 10.8813 3.79086 12.8959 6.28 13.7L5.5 16.8C5.5 16.8 5.45 17.05 5.7 16.9L9.46 14.34C9.64 14.35 9.82 14.35 10 14.35C14.4183 14.35 18 11.4517 18 7.85C18 4.24827 14.4183 1.35 10 1.35V2Z"
      fill="currentColor"
    />
  </svg>
);

const KakaoIcon = memo(KakaoIconComponent);
KakaoIcon.displayName = 'KakaoIcon';

const LoginButtonComponent: React.FC = () => {
  const { login, logout, isAuthenticated, isLoading, user } = useAuth();

  const handleClick = useCallback(async () => {
    try {
      if (isAuthenticated) {
        await logout();
      } else {
        await login();
      }
    } catch (error) {
      // useAuth가 에러 상태를 관리하므로 추가 처리가 필요하다면 여기서 수행
      console.error(error);
    }
  }, [isAuthenticated, login, logout]);

  if (isLoading) {
    return (
      <Button variant="default" disabled>
        로딩 중...
      </Button>
    );
  }

  return (
    <Button
      variant={isAuthenticated ? "secondary" : "kakao"}
      onClick={handleClick}
      size="medium"
    >
      {isAuthenticated ? (
        `${user?.name || '사용자'}님 로그아웃`
      ) : (
        <>
          <KakaoIcon />
          카카오 로그인
        </>
      )}
    </Button>
  );
};

const LoginButton = memo(LoginButtonComponent);

LoginButton.displayName = 'LoginButton';

export default LoginButton;