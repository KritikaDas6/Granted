# Student Flow – Research Matching App MVP

**Hackathon-ready spec | Pure JavaScript | Ripplematch-style matching**

---

## A) Student UX User Flow

### Flow Overview

```
Login/Signup → Profile Builder → Upload Documents → View Matches + AI Chat
```

### Step-by-Step Screens & Actions

| Step | Screen | User Action | Success | Failure |
|------|--------|-------------|---------|---------|
| 1 | **Login/Signup** | Enter email + password (or "Sign up with Google" placeholder) | Redirect to Profile Builder | Show inline error; stay on screen |
| 2 | **Profile Builder** | Fill interests (tags), skills (tags), optional links (URLs) | Advance to Upload section | Validation errors under each field; prevent "Continue" |
| 3 | **Upload Section** | Add resume (PDF required), optional publication PDFs | Show file preview with ✓ | Show error toast; highlight upload zone in red |
| 4 | **Matches Screen** | Browse match cards, filter/sort, select a match, chat with AI | Match cards load; AI responds in context | Empty state if no matches; error toast on load fail |
| 5 | **AI Chat** | Ask questions about selected match | AI replies with match-specific context | Generic fallback response; retry option |

### Success Path

1. **Login** → User lands on Profile Builder (or skips to Matches if profile exists).
2. **Profile** → User completes required fields → "Save & Continue" → Upload section.
3. **Upload** → Resume uploaded → Optional publications added → "Find Matches" → Matches screen.
4. **Matches** → User sees feed → Clicks a card → Right panel shows "Why this match" + AI chat.

### Failure Paths

- **Login fail** → Inline error: "Invalid credentials. Try again."
- **Profile validation** → Red borders + helper text on invalid fields.
- **PDF upload fail** → Toast: "Only PDFs under 10MB accepted."
- **No matches** → Empty state: "No matches yet. Update your profile or check back later."
- **AI error** → Chat shows: "Something went wrong. Try again."

---

## B) Wireframe-Level Layout Descriptions

### 1) Login/Signup Screen

```
┌─────────────────────────────────────────────────────────┐
│                    [Logo] Granted                        │
│                                                         │
│              Research Matching for Students             │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Email                                          │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Password                                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [        Sign In        ]   or   [ Sign Up ]           │
│                                                         │
│  ─────────── or ───────────                             │
│  [    Continue with Google (placeholder)    ]           │
│                                                         │
│  Forgot password?                                       │
└─────────────────────────────────────────────────────────┘
```

- **Layout**: Centered card (max-width ~400px) on neutral background.
- **Elements**: Logo, headline, email input, password input, primary CTA (Sign In / Sign Up toggle), OAuth placeholder, forgot password link.
- **States**: Default, loading (spinner on button), error (inline message below form).

---

### 2) Student Onboarding / Profile Builder

```
┌─────────────────────────────────────────────────────────┐
│  [← Back]     Your Profile        Step 1 of 2           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Research Interests *                                   │
│  ┌─────┐ ┌──────────┐ ┌─────────┐  [+ Add]             │
│  │ ML  │ │ NLP      │ │ Systems │                       │
│  └─────┘ └──────────┘ └─────────┘                       │
│  (Chips/tags; click X to remove)                        │
│                                                         │
│  Skills *                                               │
│  ┌──────────┐ ┌─────────┐ ┌──────┐  [+ Add]            │
│  │ Python   │ │ PyTorch  │ │ C++  │                     │
│  └──────────┘ └─────────┘ └──────┘                      │
│                                                         │
│  Publications (optional)                                │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Title, journal, year...                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Links (optional)                                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │ https://github.com/...                      [Add] │   │
│  └─────────────────────────────────────────────────┘   │
│  • GitHub  • LinkedIn  • Personal site                  │
│                                                         │
│                    [ Continue to Upload → ]             │
└─────────────────────────────────────────────────────────┘
```

- **Layout**: Single column, max-width ~600px. Progress indicator "Step 1 of 2".
- **Sections**: Interests (chips), Skills (chips), Publications (textarea), Links (URL inputs with labels).
- **Behavior**: Tags added via input + Enter or Add button; removed via X on chip.

---

### 3) Upload Section (Resume + Publications PDFs)

```
┌─────────────────────────────────────────────────────────┐
│  [← Back]     Upload Documents    Step 2 of 2           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Resume (required) *                                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │     📄  Drag & drop PDF or click to upload      │   │
│  │         Max 10MB                                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ─── After upload: ───                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 📄 resume.pdf    2.1 MB    ✓ Uploaded  [Remove] │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Publication PDFs (optional)                            │
│  ┌─────────────────────────────────────────────────┐   │
│  │     📄  Add another PDF                          │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ 📄 paper1.pdf    890 KB   ✓  [Remove]            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│               [ Find My Matches ]                        │
└─────────────────────────────────────────────────────────┘
```

- **Layout**: Same single-column style as Profile. Drop zones are dashed borders.
- **Resume**: Single required file. Shows filename, size, status.
- **Publications**: Multiple optional PDFs. Same preview row per file.
- **States**: Empty (drag zone), hover (highlight), uploading (spinner), uploaded (checkmark), error (red border + toast).

---

### 4) Matches Screen (Ripplematch-Style)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [Logo] Granted    Matches                    [Profile ▼] [🔔]                │
├─────────────────────────────────┬────────────────────────────────────────────┤
│                                 │                                            │
│  Filters: [All ▼] [Score ▼]     │   WHY THIS MATCH                           │
│  Sort: [Best match ▼]           │   ─────────────────────────────────        │
│                                 │   When a card is selected:                  │
│  ┌─────────────────────────┐   │   • Match score breakdown                   │
│  │ Prof. Jane Chen         │   │   • Key alignment reasons (bullets)          │
│  │ Lab: ML Systems         │◀──┼───• Tags: ML, Distributed Systems            │
│  │ ★★★★☆ 92%              │   │   • "Ask about this match" prompt            │
│  │ Research focus...       │   │                                            │
│  └─────────────────────────┘   │   AI CHAT                                  │
│  ┌─────────────────────────┐   │   ─────────────────────────────────        │
│  │ Dr. Alex Park           │   │   [Select a match to ask questions]         │
│  │ Lab: NLP & Dialogue     │   │   or                                        │
│  │ ★★★★☆ 88%              │   │   ┌─────────────────────────────────────┐  │
│  └─────────────────────────┘   │   │ User: Why is this a good fit?        │  │
│  ┌─────────────────────────┐   │   └─────────────────────────────────────┘  │
│  │ Prof. Sarah Kim         │   │   ┌─────────────────────────────────────┐  │
│  │ Lab: HCI                │   │   │ AI: Based on your Python and NLP... │  │
│  │ ★★★☆☆ 76%              │   │   └─────────────────────────────────────┘  │
│  └─────────────────────────┘   │   ┌─────────────────────────────────────┐  │
│                                 │   │ Type a message...            [Send] │  │
│  [Load more]                    │   └─────────────────────────────────────┘  │
│                                 │                                            │
└─────────────────────────────────┴────────────────────────────────────────────┘
```

- **Layout**: Two-panel Ripplematch-style:
  - **Left (60–65%)**: Vertical feed of match cards, scrollable. Filters/sort at top.
  - **Right (35–40%)**: Fixed panel with:
    - **Why this match**: Score, reasons, tags (updates when card selected).
    - **AI Chat**: Messages + input. Context = selected match.
- **Mobile**: Stack vertically. Matches full-width; "Why this match" + chat collapse into tabs or accordion.
- **Empty state (no selection)**: Right panel shows "Select a match to see why it's a fit and ask questions."

---

## C) Component Inventory

| Component | Props / Data | Notes |
|-----------|--------------|-------|
| **Input** | `{ id, label, type, placeholder, value, error, required, disabled }` | Standard text/email/password |
| **TagInput** | `{ label, value, suggestions, onChange, placeholder, error }` | For interests/skills; emits array of strings |
| **Chip** | `{ label, onRemove }` | Removable tag display |
| **Button** | `{ label, variant, loading, disabled, onClick }` | primary / secondary / ghost |
| **FileDropzone** | `{ accept, maxSize, onFile, files, error }` | PDF only; `files` = array of UploadedDocument |
| **FilePreview** | `{ name, size, status, onRemove }` | Single file row |
| **MatchCard** | `{ match, selected, onClick }` | `match` = MatchResult |
| **MatchScore** | `{ score, maxScore }` | e.g. 92/100 visual |
| **WhyMatchPanel** | `{ match, empty }` | Reasons, tags, score breakdown |
| **ChatBubble** | `{ message, role }` | role: 'user' \| 'assistant' |
| **ChatInput** | `{ placeholder, onSend, disabled }` | |
| **Toast** | `{ message, type, duration }` | type: success \| error \| info |
| **Modal** | `{ open, onClose, title, children }` | Optional for confirmations |
| **EmptyState** | `{ icon, title, subtitle, action }` | For no matches, no selection |

---

## D) Data Model (JSON)

### StudentProfile

```json
{
  "id": "student_001",
  "email": "student@university.edu",
  "interests": ["Machine Learning", "NLP", "Distributed Systems"],
  "skills": ["Python", "PyTorch", "C++", "TensorFlow"],
  "publications": [
    { "title": "Paper title", "journal": " venue", "year": 2024 }
  ],
  "links": [
    { "type": "github", "url": "https://github.com/..." },
    { "type": "linkedin", "url": "https://linkedin.com/..." }
  ],
  "createdAt": "2025-02-14T12:00:00Z"
}
```

### UploadedDocument

```json
{
  "id": "doc_001",
  "type": "resume",
  "name": "resume.pdf",
  "size": 2200000,
  "status": "uploaded",
  "data": "base64_or_blob_ref"
}
```

- `type`: `"resume"` | `"publication"`
- `status`: `"uploading"` | `"uploaded"` | `"error"`
- For MVP: store `data` as base64 in localStorage or hold in memory; no real backend.

### MatchResult

```json
{
  "id": "match_001",
  "professor": {
    "name": "Prof. Jane Chen",
    "lab": "ML Systems Lab",
    "institution": "University XYZ",
    "avatar": null
  },
  "score": 92,
  "maxScore": 100,
  "reasons": [
    "Strong overlap in ML and distributed systems",
    "Your Python/PyTorch skills match lab stack",
    "Publication in related venue"
  ],
  "tags": ["Machine Learning", "Distributed Systems", "Python"],
  "researchFocus": "Large-scale ML systems, model parallelism",
  "openPositions": 2
}
```

### ChatMessage

```json
{
  "id": "msg_001",
  "role": "user",
  "content": "Why is this a good fit for me?",
  "matchId": "match_001",
  "timestamp": "2025-02-14T12:05:00Z"
}
```

```json
{
  "id": "msg_002",
  "role": "assistant",
  "content": "Based on your profile, Prof. Chen's lab is a strong match because...",
  "matchId": "match_001",
  "timestamp": "2025-02-14T12:05:05Z"
}
```

- `matchId` ties the message to the selected match for context.

---

## E) Interaction Details

### Validation Rules

| Field | Rules | Error Message |
|-------|-------|---------------|
| Email | Valid email format | "Enter a valid email" |
| Password | Min 8 chars | "Password must be 8+ characters" |
| Interests | ≥ 1 tag | "Add at least one interest" |
| Skills | ≥ 1 tag | "Add at least one skill" |
| Resume | 1 PDF, ≤ 10MB | "Upload a PDF under 10MB" |
| Publication PDFs | PDF only, ≤ 10MB each | "Only PDFs under 10MB" |
| Links | Valid URL if provided | "Enter a valid URL" |

### Loading States

- **Login**: Button shows spinner, disabled.
- **Profile save**: Button spinner, form disabled.
- **Find matches**: Full-screen or inline skeleton cards + "Finding your best matches..." for ~1–2s.
- **AI chat**: Typing indicator ("...") while waiting for response.

### Empty States

- **No matches**: Illustration + "No matches yet. Refine your profile or try again later." + CTA to edit profile.
- **No selection**: Right panel: "Select a match to see why it fits and ask questions."
- **No chat history**: "Ask anything about this match" prompt.

### Error States

- **Bad PDF**: Red border on dropzone, toast: "Only PDF files under 10MB are accepted."
- **Missing required fields**: Red borders, helper text under each invalid field.
- **Network/load error**: Toast + retry button.
- **AI failure**: Chat: "Something went wrong. Try again." + Retry button.

### AI Chat Context Switching

1. User selects **Match A** → Right panel shows "Why this match" for A.
2. Chat input is enabled; any new message is tagged with `matchId: "A"`.
3. User selects **Match B** → Panel updates to B; chat history can:
   - **Option A (simpler)**: Keep all messages, but new messages use B’s context. Visually indicate which match each message refers to (e.g. small label).
   - **Option B (recommended for MVP)**: Clear chat when switching; show "Now asking about [Prof. B]. Ask anything!"
4. Dummy AI: Echo back with match name in response, or use canned answers keyed by match ID.

---

## F) Implementation-Ready Notes

### Recommended File/Folder Structure

```
Granted/
├── index.html              # SPA shell or multi-page entry
├── css/
│   ├── reset.css
│   ├── variables.css
│   └── main.css
├── js/
│   ├── app.js              # Router / screen switching
│   ├── auth.js             # Login/signup (mock)
│   ├── profile.js          # Profile form + validation
│   ├── upload.js           # PDF upload UI + state
│   ├── matches.js          # Match cards, filters, panel
│   ├── chat.js             # Chat UI + dummy AI
│   ├── data/
│   │   └── dummy-matches.js
│   └── components/         # Optional: small reusable pieces
│       ├── Chip.js
│       ├── FileDropzone.js
│       └── Toast.js
├── assets/
│   └── (icons, placeholder images)
└── STUDENT_FLOW_SPEC.md
```

### Pseudocode: PDF Upload UI State

```javascript
// upload.js
const uploadState = {
  resume: null,        // { name, size, status, data } or null
  publications: []     // array of same shape
};

function handleFileDrop(files, type) {
  const file = files[0];
  if (file.type !== 'application/pdf') {
    showToast('Only PDF files accepted', 'error');
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    showToast('File must be under 10MB', 'error');
    return;
  }
  const doc = { name: file.name, size: file.size, status: 'uploading' };
  if (type === 'resume') uploadState.resume = doc;
  else uploadState.publications.push(doc);
  renderUploadSection();
  // Simulate upload
  setTimeout(() => {
    doc.status = 'uploaded';
    doc.data = 'mock_base64_or_blob';
    if (type === 'resume') uploadState.resume = doc;
    else { /* update in publications */ }
    renderUploadSection();
  }, 500);
}

function removeFile(type, index) {
  if (type === 'resume') uploadState.resume = null;
  else uploadState.publications.splice(index, 1);
  renderUploadSection();
}
```

### Pseudocode: Generate Dummy Matches

```javascript
// data/dummy-matches.js
const DUMMY_MATCHES = [
  {
    id: 'm1',
    professor: { name: 'Prof. Jane Chen', lab: 'ML Systems Lab', institution: 'University XYZ' },
    score: 92,
    maxScore: 100,
    reasons: ['Strong overlap in ML', 'Python/PyTorch match', 'Publication fit'],
    tags: ['Machine Learning', 'Distributed Systems', 'Python'],
    researchFocus: 'Large-scale ML systems, model parallelism',
    openPositions: 2
  },
  // ... 4–6 more
];

function getDummyMatches(profile) {
  return DUMMY_MATCHES; // or shuffle, or filter by profile.interests
}
```

### Pseudocode: Chat Assistant UI Flow

```javascript
// chat.js
let selectedMatchId = null;
const chatMessages = [];

function selectMatch(matchId) {
  selectedMatchId = matchId;
  chatMessages.length = 0; // Clear on switch (Option B)
  renderWhyMatchPanel(matchId);
  renderChat();
}

function sendMessage(text) {
  if (!selectedMatchId) return;
  const userMsg = { id: genId(), role: 'user', content: text, matchId: selectedMatchId };
  chatMessages.push(userMsg);
  renderChat();
  showTypingIndicator();
  // Dummy AI
  setTimeout(() => {
    const canned = getCannedResponse(selectedMatchId, text);
    chatMessages.push({
      id: genId(),
      role: 'assistant',
      content: canned,
      matchId: selectedMatchId
    });
    hideTypingIndicator();
    renderChat();
  }, 1000);
}

function getCannedResponse(matchId, text) {
  const match = DUMMY_MATCHES.find(m => m.id === matchId);
  return `For ${match.professor.name}'s lab: ${match.reasons.join('. ')}. Your question: "${text}"`;
}
```

### Demo Script (Student Flow)

**Duration: ~3–4 minutes**

1. **Login (30s)**: "I'll sign in with my student email…" → Enter demo@university.edu, password → Sign In.
2. **Profile (60s)**: "Next I add my interests: ML, NLP, Systems. Skills: Python, PyTorch, C++. Optional: one publication, GitHub link." → Continue.
3. **Upload (45s)**: "I upload my resume…" → Drag PDF or click → See preview → "Optional: add a paper PDF." → Find My Matches.
4. **Matches (90s)**: "Here are my top matches, Ripplematch-style. I click the first card…" → Right panel shows "Why this match" with score and reasons. "I ask the AI: Why is this a good fit?" → Send → AI responds with match-specific answer. "I switch to another professor…" → Panel and chat context update. "I can filter by score or sort by best match."
5. **Wrap**: "The AI explains each match and answers my questions without leaving the page."

---

*End of Student Flow Spec. Ready for implementation.*
