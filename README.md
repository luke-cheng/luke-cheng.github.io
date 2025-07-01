# Luke Cheng - AI-Powered Personal Website

A zero-budget personal website featuring an AI chatbot powered by Google Gemini, built with Next.js 15, React 19, and TailwindCSS.

## Features

- 🤖 **AI Chatbot**: Interactive chat interface powered by Google Gemini via Vercel AI SDK
- 📱 **Responsive Design**: Mobile-first design with dark theme
- 🚀 **Static Export**: Optimized for GitHub Pages deployment
- ⚡ **Fast Performance**: Built with Next.js 15 and React 19
- 🎨 **Modern UI**: Beautiful dark theme with TailwindCSS
- 🛡️ **Comprehensive Error Handling**: Smart error categorization with personality-driven responses
- 🔄 **Smooth Transitions**: Animated chat mode transitions with expanding message history
- 📜 **Smart Scroll Detection**: Scroll indicator hides when user scrolls down
- 🎯 **Dynamic AppBar**: AppBar starts at bottom of welcome section, becomes sticky to top when scrolled
- 💬 **Dual-State Chat Input**: Full chat interface transforms to minimal AppBar input on scroll

## Architecture

This project uses a split deployment architecture:

- **Frontend**: Static site deployed to GitHub Pages (`[username].github.io`)
- **Backend**: API routes deployed to Vercel as serverless functions

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: TailwindCSS 4
- **AI**: Google Gemini API via Vercel AI SDK
- **Deployment**: GitHub Pages (frontend) + Vercel (backend)

## Project Structure

```
app/
├── components/
│   ├── AppBar.tsx          # Dynamic navigation bar with sticky positioning and minimal chat input
│   ├── WelcomeSection.tsx  # Hero section with full chat interface and scroll detection
│   ├── ChatSection.tsx     # Chat component using Vercel AI SDK with unified message history
│   ├── ChatContext.tsx     # Shared chat state management
│   ├── ChatInput.tsx       # Reusable chat input component (full and minimal variants)
│   ├── ChatMessages.tsx    # Chat message display component
│   ├── AboutSection.tsx    # About me section
│   ├── ExperienceSection.tsx # Work experience timeline
│   ├── ProjectsSection.tsx # Projects and activities
│   └── ContactSection.tsx  # Contact form and info
├── utils/
│   ├── apiClient.ts        # API communication utilities
│   ├── errorHandler.ts     # Comprehensive error handling system
│   └── README.md           # Error handling documentation
├── types/
│   └── api.ts              # API type definitions
├── layout.tsx              # Root layout
├── page.tsx               # Main page with scroll control and Intersection Observer
└── globals.css            # Global styles

api-routes/                 # Backend API routes (deployed to Vercel)
├── api/
│   ├── chat/
│   │   └── route.ts        # Chat API endpoint with AI SDK
│   └── health/
│       └── route.ts        # Health check endpoint
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Cloud API key with Gemini API enabled

### Installation

1. Clone the repository:
```bash
git clone https://github.com/luke-cheng/luke-cheng.github.io.git
cd luke-cheng.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Copy the example file
cp env.example .env.local

# Edit .env.local with your configuration
# For local development, leave NEXT_PUBLIC_API_BASE_URL empty
# For production, set it to your Vercel backend URL
# Add your Google Cloud API key (see setup instructions below)
```

4. Run the development server:

**For static export (default):**
```bash
npm run dev
```

**For API routes (chat functionality):**
```bash
npm run dev:api
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Google Cloud API Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for your project (required for API usage)

### 2. Enable Gemini API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Gemini API"
3. Click on "Gemini API" and click "Enable"

### 3. Create API Key
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "API Key"
3. Copy the generated API key
4. (Optional) Restrict the API key to only Gemini API for security

### 4. Set Environment Variable
Add your API key to your `.env.local` file:
```
GOOGLE_API_KEY=your_google_cloud_api_key_here
```

## Development Modes

### Static Export Mode (Default)
- **Command**: `npm run dev`
- **Use Case**: Frontend development, testing static features
- **API Routes**: Disabled
- **Deployment**: GitHub Pages

### API Routes Mode (Chat Enabled)
- **Command**: `npm run dev:api`
- **Use Case**: Full development with AI chat functionality
- **API Routes**: Enabled
- **Deployment**: Vercel

## Deployment

### Backend (Vercel)

1. **Connect to GitHub**: 
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js project

2. **Configure Environment Variables**:
   - In your Vercel project settings, add:
     - `GOOGLE_API_KEY`: Your Google Cloud API key (required)
     - `ENABLE_API_ROUTES`: Set to `true`

3. **Deploy**:
   - Vercel will automatically deploy on every push to your main branch
   - Note your Vercel domain (e.g., `https://your-app.vercel.app`)

### Frontend (GitHub Pages)

1. **Set Environment Variable**:
   - In your GitHub repository settings, add:
     - `NEXT_PUBLIC_API_BASE_URL`: Your Vercel backend URL

2. **Create GitHub Action** (optional):
   - Create `.github/workflows/deploy.yml` for automatic deployment
   - See the GitHub Actions section below

3. **Manual Deployment**:
```bash
npm run build
# The static files will be in the `out/` directory
# Upload to GitHub Pages or use GitHub Actions
```

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        NEXT_PUBLIC_API_BASE_URL: ${{ secrets.NEXT_PUBLIC_API_BASE_URL }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./out
```

## Environment Variables

### Required for Production

- `NEXT_PUBLIC_API_BASE_URL`: Your Vercel backend URL (e.g., `https://your-app.vercel.app`)
- `GOOGLE_API_KEY`: Your Google Cloud API key with Gemini API enabled (required for AI chat)

### Development

- `ENABLE_API_ROUTES`: Set to `true` to enable API routes for local development
- For local development, leave `NEXT_PUBLIC_API_BASE_URL` empty to use relative API paths.

## AI Integration

### Vercel AI SDK

The project uses Vercel AI SDK for seamless integration with Google Gemini:

- **Streaming Responses**: Real-time message streaming
- **Type Safety**: Full TypeScript support
- **Error Handling**: Built-in error handling with fallbacks
- **React Hooks**: `useChat()` hook for easy chat implementation
- **Chat History**: Full conversation context is maintained and passed to the AI

### AI Personality

The AI assistant has a playful, slightly sarcastic personality:
- References the "zero-budget" nature of the website
- Mentions that Luke is "probably on his phone"
- Maintains a friendly but edgy tone
- Provides helpful information about Luke and his work

### Error Handling

The chat system includes comprehensive error handling with personality-driven responses:

- **Network Issues**: Teases the user for connection problems
- **Server Issues**: Teases Luke for backend problems
- **Configuration Issues**: Teases Luke for forgetting to set up API keys
- **AI Issues**: Handles AI service problems gracefully

## Chat System Features

### Dual-State Input
- **Full Mode**: Complete chat interface under the welcome section
- **Minimal Mode**: Compact input in the AppBar when scrolled
- **Smooth Transitions**: Automatic transformation between states
- **Shared State**: Both inputs share the same chat history

### Message Display
- **Responsive Bubbles**: Chat messages adapt to content length
- **Text Wrapping**: Proper word wrapping for long messages
- **Error Integration**: Errors appear as AI messages with personality
- **Loading States**: Animated typing indicators

### Scroll Behavior
- **Smart Detection**: AppBar becomes sticky when welcome section scrolls out of view
- **Chat Mode**: Automatically enters chat mode when scrolled beyond welcome section
- **Return to Top**: Sending a message from AppBar scrolls back to full chat interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

- **Website**: [luke-cheng.github.io](https://luke-cheng.github.io)
- **GitHub**: [@luke-cheng](https://github.com/luke-cheng)
- **LinkedIn**: [Luke Cheng](https://linkedin.com/in/luke-cheng)

---

Built with ❤️ using Next.js, React, TailwindCSS, and Vercel AI SDK