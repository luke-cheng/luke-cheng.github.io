import { ChatRequest, ChatResponse } from '../types/api';

export interface ChatMessage {
  text: string;
  isUser: boolean;
}

export interface HealthResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime?: number;
  error?: string;
}

export class ApiClient {
  // Get the base URL from environment variable, fallback to relative paths for local development
  private static getBaseUrl(): string {
    // In production (Vercel), use the environment variable
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      return process.env.NEXT_PUBLIC_API_BASE_URL || '';
    }
    
    // In local development, use relative paths
    return '';
  }

  private static readonly HEALTH_ENDPOINT = '/api/health';
  private static readonly CHAT_ENDPOINT = '/api/chat';
  private static readonly HEALTH_TIMEOUT = 3000; // 3 seconds
  private static readonly CHAT_TIMEOUT = 10000; // 10 seconds

  /**
   * Check if the backend is healthy
   */
  static async checkHealth(): Promise<HealthResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.HEALTH_TIMEOUT);

      const baseUrl = this.getBaseUrl();
      const url = `${baseUrl}${this.HEALTH_ENDPOINT}`;

      const response = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('backend_down');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('backend_timeout');
      }
      throw new Error('backend_down');
    }
  }

  /**
   * Send a chat message to the AI
   */
  static async sendChatMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      // First check if backend is healthy
      await this.checkHealth();

      // Create timeout for the main API call
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.CHAT_TIMEOUT);

      const baseUrl = this.getBaseUrl();
      const url = `${baseUrl}${this.CHAT_ENDPOINT}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        // Let the error handler categorize the HTTP error
        throw { response, error: new Error(`HTTP ${response.status}`) };
      }

      return await response.json();
    } catch (error) {
      // If it's an object with response property, it's an HTTP error
      if (error && typeof error === 'object' && 'response' in error) {
        throw error;
      }

      // For other errors (network, timeout, etc.), throw the error directly
      throw error;
    }
  }
} 