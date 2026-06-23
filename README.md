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
bash
cd backend
npm install    

### 2. Environment Variables
PORT=5001
AI_API_KEY=your_actual_gemini_api_key_here

### 3. Run Backend
bash
npm run dev

### 4. Frontend Setup & Run
bash
cd frontend
npm install
npm run dev

**Open the local URL provided by Vite (usually http://localhost:5173) in browser.**

### Smart Use of AI:
'For a Full-Stack project like this, a visual development environment like Cursor provided a much more convenient setup. In Cursor, I could see the code, the CSS, and the folder structure all together and in real-time, which gave me a much faster development experience for building the UI.
I am familiar with Claude Code (Anthropic's new CLI tool that runs from the terminal), but I chose not to use it for this project. The reason is that Claude Code runs entirely inside the terminal and is great for automation, scanning local files, and Git commands.

### Decision-Making:
'I chose to build a Node.js backend and a React frontend to present a real Full-Stack project, and to use Structured JSON on the backend to make sure the frontend never breaks from the AI's responses.

### Clarity & Structure:
I handled edge cases (like non-existent users or responses missing a README) so the code wouldn't crash, and provided clear explanations in the README file.
