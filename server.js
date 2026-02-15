/**
 * Granted – Backend for AI chat (MiniMax API)
 *
 * Set MINIMAX_API_KEY in .env:
 *   MINIMAX_API_KEY=your_key_here
 *
 * Run: npm start
 * Serves frontend on port 3000, API at /api/chat
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

const MINIMAX_API_KEY = process.env.MINIMAX_API_KEY;
const MINIMAX_URL = 'https://api.minimax.io/v1/text/chatcompletion_v2';

app.post('/api/chat', async (req, res) => {
  if (!MINIMAX_API_KEY) {
    return res.status(500).json({
      error: 'MiniMax API key not configured',
      message: 'Set MINIMAX_API_KEY in .env'
    });
  }

  const { message, match, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'message is required' });
  }

  const matchContext = match
    ? `
Current match context:
- Professor: ${match.professor?.name || 'Unknown'}
- Lab: ${match.professor?.lab || ''}
- Research focus: ${match.researchFocus || ''}
- Match score: ${match.score || 0}%
- Why it's a fit: ${(match.reasons || []).join('; ')}
- Tags: ${(match.tags || []).join(', ')}
- Open positions: ${match.openPositions || 0}
`
    : 'No specific match selected.';

  const systemPrompt = `You are a helpful AI assistant for a research matching app (Granted). Students use you to learn about professor/lab matches.${matchContext}

Answer the student's questions about the selected match in a friendly, concise way. Use the match context above. If the user asks something outside the context, say you don't have that information. Keep answers under 2-3 sentences unless more detail is needed.`;

  const messages = [
    { role: 'system', name: 'AI Assistant', content: systemPrompt }
  ];

  history.forEach(function (h) {
    if (h.role && h.content) {
      messages.push({
        role: h.role === 'assistant' ? 'assistant' : 'user',
        name: h.role === 'assistant' ? 'AI Assistant' : 'User',
        content: h.content
      });
    }
  });

  messages.push({ role: 'user', name: 'User', content: message.trim() });

  try {
    const response = await fetch(MINIMAX_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + MINIMAX_API_KEY
      },
      body: JSON.stringify({
        model: 'M2-her',
        messages: messages,
        max_completion_tokens: 512,
        temperature: 0.7,
        top_p: 0.95
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errMsg = data.base_resp?.status_msg || data.error?.message || response.statusText;
      return res.status(response.status >= 400 ? response.status : 500).json({
        error: 'MiniMax API error',
        message: errMsg
      });
    }

    const statusCode = data.base_resp?.status_code;
    if (statusCode !== undefined && statusCode !== 0) {
      const errMsg = data.base_resp?.status_msg || 'MiniMax returned an error';
      return res.status(500).json({
        error: 'MiniMax API error',
        message: errMsg
      });
    }

    const content = (data.choices?.[0]?.message?.content || '').trim();
    return res.json({
      content: content || "I couldn't generate a response. Please try rephrasing your question."
    });
  } catch (err) {
    console.error('MiniMax API error:', err.message);
    return res.status(500).json({
      error: 'Failed to get AI response',
      message: err.message
    });
  }
});

app.listen(PORT, function () {
  console.log('Granted server running at http://localhost:' + PORT);
  if (!MINIMAX_API_KEY) {
    console.warn('Warning: MINIMAX_API_KEY not set. AI chat will fall back to dummy responses.');
  }
});
