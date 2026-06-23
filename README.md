# Take-Home Assignment — Junior Full-Stack Developer (AI-Native)
# GitHub Profile AI Reviewer
### Omri Naftali - 0547777442

A simple full-stack project built with React (Vite) and Node.js (Express). 
The app takes a GitHub username, fetches all public repositories, reads their README files, and uses Google Gemini AI (With My Preimum User) to get a quick project complexity evaluation and summary.

## Key Features & Fixes
- **Error Handling:** Handles cases where a GitHub user doesn't exist (404) or a repository has no README file without crashing the server.
- **Structured JSON Output:** Uses Gemini's `responseSchema` to always return a clean JSON object with `level` and `assessment`, preventing frontend render errors.
- **macOS Port Fix:** Runs on port 5001 to avoid conflicts with the macOS AirPlay service which defaults to port 5000.

## Installation & Setup

### 1. Backend Setup
```bash
cd backend
npm install

### 2. Environment Variables
PORT=5001
AI_API_KEY=your_actual_gemini_api_key_here

### 3. Run Backend
```bash
npm run dev
