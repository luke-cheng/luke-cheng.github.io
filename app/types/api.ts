// Error types for API responses
export enum ApiErrorType {
  // AI/Content errors
  AI_SAFETY_FILTER = 'ai_safety_filter',
  AI_CONTENT_POLICY = 'ai_content_policy',
  AI_UNAVAILABLE = 'ai_unavailable',
  AI_RATE_LIMITED = 'ai_rate_limited',
  
  // Request errors
  INVALID_REQUEST = 'invalid_request',
  MISSING_MESSAGE = 'missing_message',
  MESSAGE_TOO_LONG = 'message_too_long',
  
  // Server errors
  INTERNAL_ERROR = 'internal_error',
  SERVICE_UNAVAILABLE = 'service_unavailable'
}

// API response interfaces
export interface ChatRequest {
  message: string;
  history?: Array<{
    text: string;
    isUser: boolean;
  }>;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
  error?: never;
}

export interface ChatErrorResponse {
  error: ApiErrorType;
  message: string;
  timestamp: string;
  response?: never;
} 