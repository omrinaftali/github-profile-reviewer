# Take-Home Assignment — Junior Full-Stack Developer (AI-Native)

# GitHub Profile AI Reviewer

### Omri Naftali - 0547777442

A simple full-stack project built with React (Vite) and Node.js (Express).

The app takes a GitHub username, fetches all public repositories, reads their README files, and uses Google Gemini AI to generate a quick project complexity evaluation and summary.

---

## Key Features & Fixes

- **Error Handling:** Handles cases where a GitHub user doesn't exist (404) or a repository has no README file without crashing the server.
- **Structured JSON Output:** Uses Gemini's `responseSchema` to always return a clean JSON object with `level` and `assessment`, preventing frontend render errors.
- **macOS Port Fix:** Runs on port `5001` to avoid conflicts with the macOS AirPlay service which commonly uses port `5000`.

---

## Installation & Setup

### 1. Backend Setup

```bash
cd backend
npm install
```

### 2. Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5001
AI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Run Backend

```bash
npm run dev
```

### 4. Frontend Setup & Run

```bash
cd frontend
npm install
npm run dev
```

Open the local URL provided by Vite (usually `http://localhost:5173`) in your browser.

---

## Smart Use of AI

For a full-stack project like this, I used AI tools to accelerate development and improve productivity.

Cursor provided a convenient visual environment where I could work with the codebase, UI, CSS, and project structure simultaneously.

I am also familiar with Claude Code, Anthropic's terminal-based coding assistant, but chose Cursor because it was better suited for rapid frontend and full-stack iteration during this assignment.

---

## Technical Decisions

- Built with **React + Vite** for a fast frontend development experience.
- Built with **Node.js + Express** for a lightweight backend API.
- Used **Google Gemini AI** to analyze repository README files.
- Implemented **structured JSON responses** to guarantee predictable frontend rendering.

---

## Edge Cases Handled

- GitHub user does not exist.
- Repository has no README file.
- Empty or invalid AI responses.
- API failures and unexpected server errors.

---

## Future Improvements

- Add repository filtering and sorting.
- Cache GitHub and AI responses.
- Add authentication and usage limits.
- Improve UI with loading states and progress tracking.
