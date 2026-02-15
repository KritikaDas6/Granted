(function (global) {
  'use strict';

  var selectedMatchId = null;
  var chatMessages = [];
  var isTyping = false;

  function getCannedResponse(matchId, userText) {
    var matches = typeof getDummyMatches === 'function' ? getDummyMatches() : [];
    var match = matches.find(function (m) { return m.id === matchId; });
    if (!match) {
      return "I don't have details about that match. Try selecting a different one.";
    }
    var name = match.professor && match.professor.name ? match.professor.name : 'this lab';
    var reasons = match.reasons && match.reasons.length
      ? match.reasons.join('. ')
      : 'Your profile seems to align well with their research focus.';
    var lower = (userText || '').toLowerCase();
    if (lower.indexOf('why') >= 0 || lower.indexOf('fit') >= 0 || lower.indexOf('good') >= 0) {
      return "For " + name + "'s lab: " + reasons;
    }
    if (lower.indexOf('research') >= 0 || lower.indexOf('focus') >= 0) {
      return name + "'s research focuses on: " + (match.researchFocus || 'Various topics in their field.');
    }
    if (lower.indexOf('position') >= 0 || lower.indexOf('open') >= 0) {
      return "They currently have " + (match.openPositions || 1) + " open position(s).";
    }
    return "For " + name + ": " + reasons + " Your question: \"" + (userText || '') + "\"";
  }

  function renderChat() {
    var container = document.getElementById('chat-messages');
    var placeholder = document.getElementById('chat-placeholder');
    var typingEl = document.getElementById('chat-typing');

    if (!container) return;

    if (!selectedMatchId) {
      if (placeholder) {
        placeholder.textContent = 'Select a match to ask questions.';
        placeholder.classList.remove('chat-placeholder-hidden');
        placeholder.hidden = false;
      }
      container.querySelectorAll('.chat-bubble').forEach(function (el) { el.remove(); });
      if (typingEl) typingEl.classList.add('chat-typing-hidden');
      return;
    }

    if (chatMessages.length === 0 && !isTyping) {
      if (placeholder) {
        placeholder.textContent = 'Ask anything about this match.';
        placeholder.hidden = false;
      }
      container.querySelectorAll('.chat-bubble').forEach(function (el) { el.remove(); });
      if (typingEl) typingEl.classList.add('chat-typing-hidden');
      return;
    }

    if (placeholder) placeholder.hidden = true;

    var existing = container.querySelectorAll('.chat-bubble');
    var needed = chatMessages.length;
    if (existing.length !== needed) {
      existing.forEach(function (el) { el.remove(); });
      chatMessages.forEach(function (msg) {
        var bubble = document.createElement('div');
        bubble.className = 'chat-bubble chat-bubble-' + (msg.role === 'user' ? 'user' : 'assistant');
        var content = document.createElement('div');
        content.className = 'bubble-content';
        content.textContent = msg.content;
        bubble.appendChild(content);
        container.appendChild(bubble);
      });
    }

    if (typingEl) {
      if (isTyping) {
        typingEl.classList.remove('chat-typing-hidden');
      } else {
        typingEl.classList.add('chat-typing-hidden');
      }
    }

    container.scrollTop = container.scrollHeight;
  }

  function setTyping(typing) {
    isTyping = typing;
    renderChat();
  }

  function selectMatch(matchId) {
    selectedMatchId = matchId;
    chatMessages = [];
    renderChat();
  }

  function getMatchContext() {
    var matches = typeof getDummyMatches === 'function' ? getDummyMatches() : [];
    return matches.find(function (m) { return m.id === selectedMatchId; }) || null;
  }

  function sendMessage(text) {
    if (!selectedMatchId || !text || !text.trim()) return;

    var genId = global.Granted && global.Granted.utils ? global.Granted.utils.genId : function () { return 'm' + Date.now(); };

    var userMsg = {
      id: genId(),
      role: 'user',
      content: text.trim(),
      matchId: selectedMatchId,
      timestamp: new Date().toISOString()
    };
    chatMessages.push(userMsg);
    renderChat();

    var chatInput = document.getElementById('chat-input');
    if (chatInput) chatInput.value = '';

    setTyping(true);

    setTimeout(function () {
      var response = getCannedResponse(selectedMatchId, text);
      chatMessages.push({
        id: genId(),
        role: 'assistant',
        content: response,
        matchId: selectedMatchId,
        timestamp: new Date().toISOString()
      });
      setTyping(false);
    }, 600 + Math.random() * 400);
  }

  function initChat() {
    var input = document.getElementById('chat-input');
    var sendBtn = document.getElementById('chat-send');

    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          sendMessage(input.value);
        }
      });
    }
    if (sendBtn) {
      sendBtn.addEventListener('click', function () {
        sendMessage(input ? input.value : '');
      });
    }
  }

  function enableChat(enable) {
    var input = document.getElementById('chat-input');
    var sendBtn = document.getElementById('chat-send');
    if (input) input.disabled = !enable;
    if (sendBtn) sendBtn.disabled = !enable;
  }

  global.Granted = global.Granted || {};
  global.Granted.chat = {
    init: initChat,
    selectMatch: selectMatch,
    sendMessage: sendMessage,
    enableChat: enableChat,
    render: renderChat
  };
})(typeof window !== 'undefined' ? window : this);
