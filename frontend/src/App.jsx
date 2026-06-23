import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

const handleAnalyze = async (e) => {
e.preventDefault();
if (!username.trim()) return;

setLoading(true);
setError('');
setResults(null);

try {
// Connecting to the Node.js backend we built (running on port 5001)
const response = await fetch('http://localhost:5001/api/analyze', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
},
body: JSON.stringify({ username: username.trim() }),
});

const data = await response.json();

if (!response.ok) {
throw new Error(data.error || 'Something went wrong');
}

setResults(data);
} catch (err) {
setError(err.message);
} finally {
setLoading(false);
}
};

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>GitHub Profile AI Reviewer</h1>
        <p>Enter a GitHub username (ONLY USERNAME) to get an automated AI assessment of their public repositories.</p>
      </header>

      <form onSubmit={handleAnalyze} className="search-form">
        <input
          type="text"
          placeholder="ONLY USERNAME, e.g. : omrinaftali" /* This is My GitHub Username */
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Analyzing with AI...' : 'Analyze Profile'}
        </button>
      </form>

      {/* Render error messages cleanly (e.g., user not found) */}
      {error && <div className="error-message"> {error}</div>}

      {/* Loading State */}
      {loading && (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Fetching repositories and generating AI assessments... This may take a few seconds.</p>
        </div>
      )}

      {/* Render results received from the Backend */}
      {results && (
        <div className="results-container">
          <h2>
            Results for <span>@{results.username}</span> ({results.total_repos} Repositories found)
          </h2>
          
          <div className="repos-grid">
            {results.repos.map((repo, index) => (
              <div key={index} className="repo-card">
                <h3>{repo.name}</h3>
                
                <div className="badge-container">
                  <span className={`badge ${repo.level.toLowerCase()}`}>
                    Level: {repo.level}
                  </span>
                  {!repo.hasReadme && (
                    <span className="badge no-readme">No README</span>
                  )}
                </div>

                <p className="assessment-text">
                  <strong>AI Assessment:</strong> {repo.assessment}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;