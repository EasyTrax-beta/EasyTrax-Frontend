// 사용자 친화적인 에러 메시지 매핑
const ERROR_MESSAGES = {
  // 네트워크 에러
  'Network Error': '인터넷 연결을 확인해주세요.',
  'ERR_NETWORK': '네트워크 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.',
  'ERR_INTERNET_DISCONNECTED': '인터넷 연결이 끊어졌습니다.',
  
  // 인증 에러
  'AUTH401': '로그인이 필요합니다. 다시 로그인해주세요.',
  'INVALID_TOKEN': '인증이 만료되었습니다. 다시 로그인해주세요.',
  'EXPIRED_TOKEN': '로그인이 만료되었습니다. 다시 로그인해주세요.',
  'Unauthorized': '권한이 없습니다. 로그인 상태를 확인해주세요.',
  
  // 카카오 로그인 에러
  'access_denied': '카카오 로그인이 취소되었습니다.',
  'invalid_request': '로그인 요청에 문제가 있습니다. 다시 시도해주세요.',
  'server_error': '카카오 로그인 서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  '카카오 로그인 실패': '카카오 로그인에 실패했습니다. 다시 시도해주세요.',
  '인증 코드를 받지 못했습니다.': '로그인 과정에서 문제가 발생했습니다. 다시 시도해주세요.',
  'ID 토큰을 받지 못했습니다.': '카카오 로그인 인증에 실패했습니다. 다시 시도해주세요.',
  
  // 서버 에러
  'Internal Server Error': '서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
  '500': '서버 오류가 발생했습니다. 관리자에게 문의해주세요.',
  'Service Unavailable': '서비스가 일시적으로 이용할 수 없습니다. 잠시 후 다시 시도해주세요.',
  'Bad Gateway': '서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.',
  
  // 파일 업로드 에러
  'File too large': '파일 크기가 너무 큽니다. 10MB 이하의 파일을 업로드해주세요.',
  'Invalid file type': '지원하지 않는 파일 형식입니다. PDF, JPG, PNG, DOC, DOCX 파일만 업로드 가능합니다.',
  'Upload failed': '파일 업로드에 실패했습니다. 다시 시도해주세요.',
  
  // 일반적인 에러
  'Not Found': '요청하신 페이지를 찾을 수 없습니다.',
  'Forbidden': '접근 권한이 없습니다.',
  'Bad Request': '잘못된 요청입니다. 입력 내용을 확인해주세요.',
  'Timeout': '요청 시간이 초과되었습니다. 다시 시도해주세요.',
  
  // 기본 메시지
  'Unknown error': '알 수 없는 오류가 발생했습니다. 문제가 지속되면 고객센터로 문의해주세요.',
  'default': '오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
} as const;

/**
 * 에러를 사용자 친화적인 메시지로 변환
 */
export const getErrorMessage = (error: unknown): string => {
  if (!error) {
    return ERROR_MESSAGES.default;
  }

  // Error 객체인 경우
  if (error instanceof Error) {
    const message = error.message;
    
    // 정확히 일치하는 메시지가 있는지 확인
    if (message in ERROR_MESSAGES) {
      return ERROR_MESSAGES[message as keyof typeof ERROR_MESSAGES];
    }
    
    // 부분 문자열 매칭
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (message.includes(key)) {
        return value;
      }
    }
    
    return message || ERROR_MESSAGES.default;
  }

  // 문자열인 경우
  if (typeof error === 'string') {
    if (error in ERROR_MESSAGES) {
      return ERROR_MESSAGES[error as keyof typeof ERROR_MESSAGES];
    }
    
    // 부분 문자열 매칭
    for (const [key, value] of Object.entries(ERROR_MESSAGES)) {
      if (error.includes(key)) {
        return value;
      }
    }
    
    return error || ERROR_MESSAGES.default;
  }

  // 객체인 경우 (Axios 에러 등)
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    
    // Axios 에러 처리
    if (errorObj.response?.status) {
      const status = errorObj.response.status;
      switch (status) {
        case 401:
          return ERROR_MESSAGES.AUTH401;
        case 403:
          return ERROR_MESSAGES.Forbidden;
        case 404:
          return ERROR_MESSAGES['Not Found'];
        case 500:
          return ERROR_MESSAGES['Internal Server Error'];
        case 503:
          return ERROR_MESSAGES['Service Unavailable'];
        default:
          break;
      }
    }
    
    // 메시지가 있는 경우
    if (errorObj.message) {
      return getErrorMessage(errorObj.message);
    }
    
    // 코드가 있는 경우
    if (errorObj.code) {
      return getErrorMessage(errorObj.code);
    }
  }

  return ERROR_MESSAGES.default;
};

/**
 * 에러 로깅을 위한 원본 에러 메시지 추출
 */
export const getOriginalErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as any;
    return errorObj.message || errorObj.code || JSON.stringify(error);
  }
  
  return 'Unknown error';
};