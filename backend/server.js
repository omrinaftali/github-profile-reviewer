const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Loading env variables must be done before initializing the SDK!
const { GoogleGenAI, Type } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 5000;

// Expanded CORS configuration to ensure no browser blocks the requests
app.use(cors({
    origin: '*', // Allows any frontend to access the server
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initializing the Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.AI_API_KEY });

// Helper function to send the README content to Gemini for analysis
async function analyzeReadmeWithAI(repoName, readmeText) {
    try {
        const prompt = `
        You are an expert technical recruiter and code reviewer. 
        Analyze the following GitHub repository README file for the project named "${repoName}".
        Assess its complexity level (Basic, Intermediate, or Advanced) and provide a short, 
        concise 2-sentence summary evaluating the clarity of instructions and the developer's skill level.
        
        README Content:
        ${readmeText}
        `;

        // Calling Gemini 2.5 Flash with Structured Outputs
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        level: { 
                            type: Type.STRING, 
                            description: "The project's complexity level: 'Basic', 'Intermediate', or 'Advanced'." 
                        },
                        assessment: { 
                            type: Type.STRING, 
                            description: "A short 2-sentence assessment of the project and README clarity." 
                        }
                    },
                    required: ["level", "assessment"],
                }
            }
        });

        // Parsing the result returned from the AI as a JSON object
        return JSON.parse(response.text);

    } catch (aiError) {
        console.error(`AI Analysis failed for ${repoName}:`, aiError.message);
        // Default values to prevent the entire process from crashing if a single AI call fails
        return {
            level: 'Unknown',
            assessment: 'Failed to generate AI assessment for this repository.'
        };
    }
}

// Health check endpoint to verify the server status
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running perfectly!' });
});

// Main endpoint that fetches data from GitHub and analyzes it using AI
app.post('/api/analyze', async (req, res) => {
    const { username } = req.body;

    // Basic protection - if no username was provided
    if (!username) {
        return res.status(400).json({ error: 'GitHub username is required.' });
    }

    // Prepare authorization headers if GITHUB_TOKEN is available in env
    const githubHeaders = {};
    if (process.env.GITHUB_TOKEN) {
        githubHeaders['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    try {
        console.log(`Fetching repositories for user: ${username}`);
        
        // First call: Fetch all public repositories of the user (with auth headers to prevent 403 Rate Limit)
        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`, {
            headers: githubHeaders
        });
        const repos = reposResponse.data;

        // Create an array of Promises to process everything concurrently
        const detailedReposPromises = repos.map(async (repo) => {
            let readmeText = '';
            let hasReadme = false;

            try {
                // Second call: Attempt to fetch the README file for the specific repository (with auth headers)
                const readmeResponse = await axios.get(`https://api.github.com/repos/${username}/${repo.name}/readme`, {
                    headers: githubHeaders
                });
                const encodedContent = readmeResponse.data.content;
                readmeText = Buffer.from(encodedContent, 'base64').toString('utf-8');
                hasReadme = true;
            } catch (readmeError) {
                // If there is no README, set a default fallback text to pass to the AI
                readmeText = 'No README file provided for this repository. The user has not documented this project.';
                hasReadme = false;
            }

            // Third call: Send the content to Gemini for analysis
            const aiAnalysis = await analyzeReadmeWithAI(repo.name, readmeText);

            return {
                name: repo.name,
                hasReadme: hasReadme,
                level: aiAnalysis.level,         
                assessment: aiAnalysis.assessment 
            };
        });

        // Wait for all README fetches and AI analyses to complete
        const analyzedRepos = await Promise.all(detailedReposPromises);

        // Return the fully analyzed response back to the frontend
        return res.json({
            username,
            total_repos: analyzedRepos.length,
            repos: analyzedRepos
        });

    } catch (error) {
        // Critical edge case handling: The user does not exist on GitHub (404 Error)
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: `GitHub user '${username}' not found.` });
        }
        
        // Other general server errors
        console.error('Server Error:', error.message);
        return res.status(500).json({ error: 'Something went wrong on our side. Please try again later.' });
    }
});

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});