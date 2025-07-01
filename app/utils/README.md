# Error Handling System

This directory contains a comprehensive error handling system for the AI chat application.

## Overview

The error handling system categorizes different types of errors and provides appropriate responses based on the AI assistant's personality. It distinguishes between user-related issues (like network problems) and server-related issues (like backend problems).

## Files

### `errorHandler.ts`
Main error handling logic with:
- **Error Types**: Enumeration of all possible error types
- **Error Categories**: Grouping errors by category (user network, server issues, etc.)
- **Error Detection**: Utilities to detect specific error conditions
- **Error Categorization**: Logic to categorize errors based on type and context
- **Response Generation**: Personality-driven error messages

### `apiClient.ts`
API communication utilities with:
- **Health Checks**: Backend health monitoring
- **Chat API**: Message sending with proper error handling
- **Error Handling**: Integration with the error handler

## Error Categories

### 1. User Network Issues (`USER_NETWORK`)
- **Causes**: User's internet connection, WiFi problems, browser issues
- **Detection**: `window.navigator.onLine`, network error types
- **Response**: Teases the user for connection problems
- **Examples**: "Your internet is broken", "Bad WiFi", "Connection failed"

### 2. Server Issues (`SERVER_ISSUES`)
- **Causes**: Backend down, server errors, Vercel rate limiting
- **Detection**: HTTP 5xx status codes, backend health checks
- **Response**: Teases Luke for server problems, mentions notification
- **Examples**: "Luke forgot to pay bills", "Backend is down", "Vercel rate limited"

### 3. API Problems (`API_PROBLEMS`)
- **Causes**: Invalid requests, authentication issues, API errors
- **Detection**: HTTP 4xx status codes (except 429)
- **Response**: Teases Luke for API issues, mentions notification
- **Examples**: "API is misbehaving", "Backend code problems"

### 4. AI Issues (`AI_ISSUES`)
- **Causes**: Safety filter violations, content policy issues, AI service unavailable
- **Detection**: Specific AI error types from Gemini API
- **Response**: Professional responses for safety/content issues, teases Luke for service issues
- **Examples**: "Violates safety guidelines", "AI service unavailable"

## Usage

### Basic Error Handling
```typescript
import { handleError } from './errorHandler';

try {
  const response = await fetch('/api/chat', { /* ... */ });
  // ... handle response
} catch (error) {
  const errorMessage = handleError(error);
  // Display errorMessage to user
}
```

### Using API Client
```typescript
import { ApiClient } from './apiClient';

try {
  const response = await ApiClient.sendChatMessage(request);
  // ... handle response
} catch (error) {
  const errorMessage = ApiClient.handleApiError(error);
  // Display errorMessage to user
}
```

## Error Detection Features

### Network Status
- Uses `window.navigator.onLine` to detect internet connectivity
- Distinguishes between network errors and server timeouts

### Vercel Rate Limiting
- Detects Vercel-specific rate limiting headers
- Provides special response about unexpected traffic

### Timeout Handling
- Separate timeouts for health checks (3s) and chat requests (10s)
- Distinguishes between connection timeouts and server timeouts

### AI Safety Filters
- Ready for Gemini API safety filter integration
- Handles content policy violations professionally

## Personality Guidelines

### User Network Issues
- **Tone**: Teasing but not mean
- **Focus**: User's connection problems
- **No Luke notification**: User's fault, not Luke's

### Server/API Issues
- **Tone**: Teasing Luke for technical problems
- **Focus**: Luke's responsibility for backend
- **Luke notification**: Always mention automated notification
- **Contact info**: Direct users to contact Luke

### AI Issues
- **Safety/Content**: Professional, no teasing
- **Service issues**: Tease Luke, mention notification

## Integration with Gemini API

The system is designed to work with Google Gemini API:

1. **Safety Filters**: Handle `ai_safety_filter` errors
2. **Content Policy**: Handle `ai_content_policy` errors
3. **Rate Limiting**: Handle Gemini API rate limits
4. **Service Issues**: Handle Gemini API unavailability

## Future Enhancements

1. **Real-time Monitoring**: Log errors for Luke to review
2. **Retry Logic**: Automatic retry for transient errors
3. **User Feedback**: Allow users to report persistent issues
4. **Analytics**: Track error patterns and frequency 