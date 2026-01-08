# Socratize

**An AI-Powered Socratic Tutoring Platform**

*Authors: Laurent Mwamba & Joshua Palma*
*January 2026*

## Overview

Socratize is an interactive educational platform that leverages Google's Gemini AI to provide personalized tutoring using the Socratic method. Rather than providing direct answers, Socratize guides students to discover solutions through thoughtful questioning and logical reasoning.

The platform supports multiple subjects including:
- Algebra & Calculus
- Physics & Mechanics
- World History
- Computer Science
- Chemistry
- Critical Writing

View the app in AI Studio: https://ai.studio/apps/drive/1YpTpSozbQgXCboORlT3Ngbv2t_k17e0L

## Features

- **Socratic Method Teaching**: AI tutor that guides through questions rather than direct answers
- **Multi-Subject Support**: Covers mathematics, sciences, humanities, and programming
- **Image Analysis**: Upload problem images for visual context understanding
- **Step-by-Step Guidance**: Breaks complex problems into manageable steps
- **Learning Journey Tracking**: Monitors progress through each problem-solving stage
- **LaTeX Support**: Rich mathematical notation rendering

## Prerequisites

- Node.js >= 20.0.0
- npm >= 10.0.0
- Gemini API Key ([Get one here](https://aistudio.google.com/app/apikey))

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd socratize
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the project root and add your Gemini API key:
   ```
   API_KEY=your_gemini_api_key_here
   ```

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm run preview
```

The app will be available at `http://localhost:5173` (or the port shown in your terminal).

## Testing

Socratize includes comprehensive unit and integration tests.

### Unit Tests
Unit tests use mocks and don't consume API tokens:
```bash
npm run test:unit
```

### Integration Tests
Integration tests make real API calls to verify functionality:
```bash
npm run test:integration
```

**Note**: Integration tests require a valid `API_KEY` in your `.env.local` file and will consume Gemini API tokens. The tests automatically detect quota limits and skip remaining tests when exceeded.

### Watch Mode
Run tests in watch mode during development:
```bash
npm run test:watch
```

### Debugging Tests in IntelliJ
1. Open Run Configurations dropdown
2. Select "Debug Gemini Service Tests" or "Debug Gemini Integration Tests"
3. Set breakpoints in service files
4. Click the debug icon (🐛)

## Project Structure

```
socratize/
├── services/           # API services and business logic
│   ├── geminiService.ts
│   ├── geminiServices.test.ts
│   └── geminiService.integration.test.ts
├── constants.ts        # App constants and system prompts
├── types/             # TypeScript type definitions
├── .env.local         # Environment variables (API keys)
└── package.json       # Project dependencies and scripts
```

## Architecture

### Gemini Service
The core of Socratize is the Gemini service that handles:
- **Message Processing**: Converts conversation history to Gemini format
- **Content Generation**: Generates Socratic responses using Gemini 3.0 Pro
- **Problem Decomposition**: Breaks problems into 4-6 logical steps
- **Error Handling**: Gracefully handles API errors and quota limits

### Testing Strategy
- **Unit Tests**: Mock external dependencies for fast, isolated testing
- **Integration Tests**: Verify real API behavior with quota-aware error handling
- **Debug Configurations**: Pre-configured IntelliJ setups for easy debugging

## Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build |
| `npm test` | Run all tests once |
| `npm run test:unit` | Run unit tests only (no API calls) |
| `npm run test:integration` | Run integration tests (uses API tokens) |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:all` | Run both unit and integration tests |

### Contributing

When contributing to Socratize:
1. Run unit tests before committing: `npm run test:unit`
2. Ensure TypeScript types are properly defined
3. Follow the existing code style and patterns
4. Add tests for new features
5. Be mindful of API token usage in integration tests

## Troubleshooting

**API Key Issues:**
- Ensure `.env.local` file exists in project root
- Verify `API_KEY` is set correctly (not `GEMINI_API_KEY`)
- Check that your API key is valid at https://aistudio.google.com

**Quota Exceeded:**
- Integration tests automatically detect quota limits
- Run unit tests instead: `npm run test:unit`
- Wait for quota reset or upgrade your API plan

**TypeScript Errors:**
- Run `npm install @types/react` if type errors occur
- Ensure TypeScript version matches project requirements

## Tech Stack

- **Frontend**: React 18.2, TypeScript, Vite
- **AI**: Google Gemini 3.0 (Pro & Flash models)
- **Testing**: Vitest, Testing Library, Happy DOM
- **Icons**: Lucide React
- **Build**: Vite 5.0

## License

[Your License Here]

## Authors

**@bonallure**
**@JoshuaIPalma**

---

*Built with ❤️ using Google Gemini AI*
