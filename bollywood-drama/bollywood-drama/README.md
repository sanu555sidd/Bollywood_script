# 🎬 Drammatic — AI Bollywood Script Generator

Turn any ordinary situation into an over-the-top Bollywood blockbuster using AI.

## Project Structure

```
bollywood-drama/
├── backend/          # Express.js API + OpenRouter AI agent
│   ├── src/
│   │   ├── agents/   # scriptAgent.js — LLM prompt logic
│   │   ├── routes/   # script.routes.js
│   │   ├── middleware/
│   │   └── index.js
│   ├── .env.example
│   └── package.json
└── frontend/         # React + Vite UI
    ├── src/
    │   ├── components/   # MovieHeader, CharacterCards, SceneCard, HistorySidebar
    │   ├── hooks/        # useHistory (localStorage)
    │   ├── utils/        # api.js
    │   ├── App.jsx
    │   └── index.css
    └── package.json
```

## Features

- **Generate** full Bollywood scripts from any situation
- **Mood selection** — Dramatic, Intense, Romantic, Comedic, Tragic, Action
- **Character cards** — Name, role, description for every character
- **Per-scene regeneration** — Re-roll any scene independently
- **Title regeneration** — Get a new movie title at will
- **History sidebar** — All past generations stored in localStorage
- **Responsive UI** — Works on mobile and desktop

## Setup & Running Locally

### Prerequisites
- Node.js 18+
- An [OpenRouter](https://openrouter.ai) API key (free tier works)

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY
npm install
npm run dev
```

Backend runs on **http://localhost:3001**

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

The Vite dev server proxies `/api` calls to the backend automatically.

## Environment Variables

| Variable | Description |
|---|---|
| `OPENROUTER_API_KEY` | Your OpenRouter API key |
| `OPENROUTER_BASE_URL` | `https://openrouter.ai/api/v1` (default) |
| `OPENROUTER_MODEL` | Model to use (default: `openai/gpt-4o-mini`) |
| `PORT` | Backend port (default: `3001`) |

### Free OpenRouter Models
- `openai/gpt-oss-120b:free`
- `nvidia/nemotron-3-super-120b-a12b:free`
- `google/gemma-4-31b-it:free`

## Tech Stack

- **Frontend**: React 18, Vite, react-hot-toast
- **Backend**: Express.js, OpenAI SDK (pointed at OpenRouter)
- **AI**: OpenRouter API with structured JSON prompting
- **Storage**: localStorage (client-side history)
