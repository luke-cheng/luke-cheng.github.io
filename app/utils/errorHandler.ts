// Error types for better categorization
export enum ErrorType {
  // Network/Connectivity errors
  NO_INTERNET = 'no_internet',
  NETWORK_ERROR = 'network_error',
  CONNECTION_TIMEOUT = 'connection_timeout',
  
  // Server/Backend errors
  BACKEND_DOWN = 'backend_down',
  BACKEND_TIMEOUT = 'backend_timeout',
  SERVER_ERROR = 'server_error',
  
  // API/Request errors
  BAD_REQUEST = 'bad_request',
  UNAUTHORIZED = 'unauthorized',
  FORBIDDEN = 'forbidden',
  NOT_FOUND = 'not_found',
  RATE_LIMITED = 'rate_limited',
  VERCEL_RATE_LIMITED = 'vercel_rate_limited',
  API_ERROR = 'api_error',
  
  // Configuration errors
  MISSING_API_KEY = 'missing_api_key',
  
  // AI/Content errors
  AI_SAFETY_FILTER = 'ai_safety_filter',
  AI_CONTENT_POLICY = 'ai_content_policy',
  AI_UNAVAILABLE = 'ai_unavailable',
  
  // Unknown errors
  UNKNOWN_ERROR = 'unknown_error'
}

// Error categories for response selection
export enum ErrorCategory {
  USER_NETWORK = 'user_network',      // User's internet/connection issues
  SERVER_ISSUES = 'server_issues',     // Backend/server problems
  API_PROBLEMS = 'api_problems',       // API/request issues
  CONFIGURATION = 'configuration',     // Configuration/missing API keys
  AI_ISSUES = 'ai_issues',            // AI service problems
  UNKNOWN = 'unknown'                 // Unknown issues
}

// Error information structure
export interface ErrorInfo {
  type: ErrorType;
  category: ErrorCategory;
  message: string;
  isUserFault: boolean; // true if it's user's fault (network), false if it's Luke's fault
  shouldNotifyLuke: boolean; // whether to mention that Luke has been notified
}

// Error detection utilities
export class ErrorDetector {
  static isOnline(): boolean {
    return typeof window !== 'undefined' && window.navigator.onLine;
  }

  static isVercelRateLimit(response: Response): boolean {
    // Vercel rate limiting typically returns 429 with specific headers
    return response.status === 429 && 
           (response.headers.get('x-vercel-rate-limit') !== null ||
            response.headers.get('x-ratelimit-limit') !== null);
  }

  static isNetworkError(error: any): boolean {
    return error instanceof TypeError && 
           (error.message.includes('fetch') || 
            error.message.includes('network') ||
            error.message.includes('Failed to fetch'));
  }

  static isTimeoutError(error: any): boolean {
    return error instanceof Error && 
           (error.name === 'AbortError' || 
            error.message.includes('timeout') ||
            error.message === 'timeout');
  }
}

// Error categorization logic
export class ErrorCategorizer {
  static categorizeError(error: any, response?: Response): ErrorInfo {
    // Check if user is offline first
    if (!ErrorDetector.isOnline()) {
      return {
        type: ErrorType.NO_INTERNET,
        category: ErrorCategory.USER_NETWORK,
        message: 'no_internet',
        isUserFault: true,
        shouldNotifyLuke: false
      };
    }

    // Check for network errors
    if (ErrorDetector.isNetworkError(error)) {
      return {
        type: ErrorType.NETWORK_ERROR,
        category: ErrorCategory.USER_NETWORK,
        message: 'network_error',
        isUserFault: true,
        shouldNotifyLuke: false
      };
    }

    // Check for timeout errors
    if (ErrorDetector.isTimeoutError(error)) {
      return {
        type: ErrorType.CONNECTION_TIMEOUT,
        category: ErrorCategory.USER_NETWORK,
        message: 'connection_timeout',
        isUserFault: true,
        shouldNotifyLuke: false
      };
    }

    // Check for specific error types
    if (error instanceof Error) {
      switch (error.message) {
        case 'GOOGLE_API_KEY is not configured':
        case 'GEMINI_API_KEY is not configured':
        case 'missing_api_key':
        case 'Invalid GOOGLE_API_KEY format':
        case 'Invalid GEMINI_API_KEY format':
          return {
            type: ErrorType.MISSING_API_KEY,
            category: ErrorCategory.CONFIGURATION,
            message: 'missing_api_key',
            isUserFault: false,
            shouldNotifyLuke: true
          };

        case 'backend_down':
          return {
            type: ErrorType.BACKEND_DOWN,
            category: ErrorCategory.SERVER_ISSUES,
            message: 'backend_down',
            isUserFault: false,
            shouldNotifyLuke: true
          };
        
        case 'backend_timeout':
          return {
            type: ErrorType.BACKEND_TIMEOUT,
            category: ErrorCategory.SERVER_ISSUES,
            message: 'backend_timeout',
            isUserFault: false,
            shouldNotifyLuke: true
          };

        case 'ai_safety_filter':
          return {
            type: ErrorType.AI_SAFETY_FILTER,
            category: ErrorCategory.AI_ISSUES,
            message: 'ai_safety_filter',
            isUserFault: false,
            shouldNotifyLuke: false
          };

        case 'ai_content_policy':
          return {
            type: ErrorType.AI_CONTENT_POLICY,
            category: ErrorCategory.AI_ISSUES,
            message: 'ai_content_policy',
            isUserFault: false,
            shouldNotifyLuke: false
          };

        case 'ai_unavailable':
          return {
            type: ErrorType.AI_UNAVAILABLE,
            category: ErrorCategory.AI_ISSUES,
            message: 'ai_unavailable',
            isUserFault: false,
            shouldNotifyLuke: true
          };
      }
    }

    // Check HTTP response status codes
    if (response) {
      if (ErrorDetector.isVercelRateLimit(response)) {
        return {
          type: ErrorType.VERCEL_RATE_LIMITED,
          category: ErrorCategory.SERVER_ISSUES,
          message: 'vercel_rate_limited',
          isUserFault: false,
          shouldNotifyLuke: true
        };
      }

      switch (response.status) {
        case 400:
          return {
            type: ErrorType.BAD_REQUEST,
            category: ErrorCategory.API_PROBLEMS,
            message: 'bad_request',
            isUserFault: false,
            shouldNotifyLuke: true
          };
        
        case 401:
          return {
            type: ErrorType.UNAUTHORIZED,
            category: ErrorCategory.API_PROBLEMS,
            message: 'unauthorized',
            isUserFault: false,
            shouldNotifyLuke: true
          };
        
        case 403:
          return {
            type: ErrorType.FORBIDDEN,
            category: ErrorCategory.API_PROBLEMS,
            message: 'forbidden',
            isUserFault: false,
            shouldNotifyLuke: true
          };
        
        case 404:
          return {
            type: ErrorType.NOT_FOUND,
            category: ErrorCategory.API_PROBLEMS,
            message: 'not_found',
            isUserFault: false,
            shouldNotifyLuke: true
          };
        
        case 429:
          return {
            type: ErrorType.RATE_LIMITED,
            category: ErrorCategory.SERVER_ISSUES,
            message: 'rate_limited',
            isUserFault: false,
            shouldNotifyLuke: true
          };
        
        case 500:
        case 502:
        case 503:
        case 504:
          return {
            type: ErrorType.SERVER_ERROR,
            category: ErrorCategory.SERVER_ISSUES,
            message: 'server_error',
            isUserFault: false,
            shouldNotifyLuke: true
          };
      }
    }

    // Default unknown error
    return {
      type: ErrorType.UNKNOWN_ERROR,
      category: ErrorCategory.UNKNOWN,
      message: 'unknown_error',
      isUserFault: false,
      shouldNotifyLuke: true
    };
  }
}

// Error response generator with personality
export class ErrorResponseGenerator {
  private static getRandomResponse(responses: string[]): string {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  static generateResponse(errorInfo: ErrorInfo): string {
    const contactInfo = "You'll find his contact info at the bottom of this page. He's probably on his phone.";
    const notificationMessage = "An automated notification has been sent to him, but if you can't wait, " + contactInfo;

    switch (errorInfo.category) {
      case ErrorCategory.USER_NETWORK:
        // Tease the user for network issues
        const networkResponses = [
          "I'm temporarily offline for 'scheduled maintenance' (read: your internet is broken). Try again later or find a human to talk to.",
          "Error 404: My patience not found. Your connection seems to be the issue. Go talk to a real person for once.",
          "Network issues detected. Probably your fault for having bad WiFi. Try moving closer to your router or something.",
          "Connection failed. Maybe try using a different browser? Or just go talk to Luke directly.",
          "Something's wrong with your connection. Not my problem though. Go figure it out yourself.",
          "Looks like your human broke the internet again. Classic human move. Maybe try turning it off and on again?"
        ];
        return this.getRandomResponse(networkResponses);

      case ErrorCategory.CONFIGURATION:
        // Tease Luke for configuration issues
        const configResponses = [
          `Luke forgot to configure the AI API key. Classic developer move - builds the whole thing but forgets to set up the keys. ${notificationMessage}`,
          `The AI service isn't configured properly. Luke probably forgot to add his Gemini API key to the environment variables. ${notificationMessage}`,
          `Missing API configuration. Luke needs to set up his Google Gemini API key. ${notificationMessage}`,
          `AI service not configured. Luke forgot to add the required Gemini API key. ${notificationMessage}`,
          `Configuration error. Luke needs to set up his environment variables properly. ${notificationMessage}`
        ];
        return this.getRandomResponse(configResponses);

      case ErrorCategory.SERVER_ISSUES:
        // Tease Luke for server issues
        if (errorInfo.type === ErrorType.VERCEL_RATE_LIMITED) {
          return `Guess he never expected this silly site would get such traffic that it's uninvited by the server host. ${notificationMessage}`;
        }
        
        const serverResponses = [
          `Looks like Luke forgot to pay his backend bills again. ${notificationMessage}`,
          `Server's having a moment. ${notificationMessage}`,
          `Backend is down. What did he pay for a "zero-budget website"? ${notificationMessage}`,
          `I don't know how he forgets to pay his backend even though he's on the free tier. ${notificationMessage}`,
          `Server maintenance break. Yes, we AI do need regular breaks too. ${notificationMessage}`,
          `Backend is taking a coffee break. ${notificationMessage}`
        ];
        return this.getRandomResponse(serverResponses);

      case ErrorCategory.API_PROBLEMS:
        // Tease Luke for API issues
        const apiResponses = [
          `There's an error in the API. Go get Luke to fix it. ${notificationMessage}`,
          `API is misbehaving. ${notificationMessage}`,
          `Something's wrong with the backend code. ${notificationMessage}`,
          `API endpoint is having issues. ${notificationMessage}`,
          `Backend configuration problem. ${notificationMessage}`
        ];
        return this.getRandomResponse(apiResponses);

      case ErrorCategory.AI_ISSUES:
        // Handle AI-specific issues
        switch (errorInfo.type) {
          case ErrorType.AI_SAFETY_FILTER:
            return "I can't respond to that - it violates my safety guidelines. Try asking something else!";
          
          case ErrorType.AI_CONTENT_POLICY:
            return "That content doesn't meet my guidelines. Let's keep it professional!";
          
          case ErrorType.AI_UNAVAILABLE:
            return `AI service is temporarily unavailable. ${notificationMessage}`;
          
          default:
            return `AI is having issues. ${notificationMessage}`;
        }

      case ErrorCategory.UNKNOWN:
      default:
        // Tease Luke for unknown issues
        const unknownResponses = [
          `There's an error in the system. Go get Luke to fix it. ${notificationMessage}`,
          `Something went wrong. ${notificationMessage}`,
          `Unknown error occurred. ${notificationMessage}`,
          `System malfunction. ${notificationMessage}`
        ];
        return this.getRandomResponse(unknownResponses);
    }
  }
}

// Main error handler function
export function handleError(error: any, response?: Response): string {
  const errorInfo = ErrorCategorizer.categorizeError(error, response);
  return ErrorResponseGenerator.generateResponse(errorInfo);
} 