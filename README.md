# Translation Chat

A simple, modular translation workflow using LangGraph with interactive feedback and glossary management.

## Architecture

- **LangGraph**: Handles the translation workflow with user interrupts
- **FastAPI Proxy**: Bridges frontend and LangGraph API
- **React Frontend**: Clean UI with Silent Edge design system using DaisyUI

## Features

- ✨ Interactive translation workflow
- 📝 Step-by-step progress visualization
- 🔄 User feedback integration with structured forms
- 📚 Glossary management with confirmation checkboxes
- 🎨 Silent Edge design system (minimal, clean UI)

## Quick Start

1. **Start all services** (recommended):

   ```bash
   ./start-dev.sh
   ```

2. **Or start individually**:

   ```bash
   # Terminal 1: LangGraph API
   cd backend && langgraph up --port 8123

   # Terminal 2: FastAPI Proxy
   cd backend && python main.py

   # Terminal 3: Frontend
   cd frontend && npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - FastAPI: http://localhost:8008
   - LangGraph: http://localhost:8123

## Configuration

The application uses environment variables for configuration. See `backend/CONFIG.md` for detailed configuration options.

**Key settings:**

- `PROD`: Set to `true` to enable production mode (prevents database modifications)
- `API_HOST`: Server host (default: 127.0.0.1)
- `API_PORT`: Server port (default: 8008)
- `LLM_API_KEY`: Your OpenAI API key

## Workflow

1. **Start Translation**: Enter text to translate
2. **Review Progress**: Watch step-by-step translation process
3. **Provide Feedback**: Accept translation or provide specific feedback
4. **Glossary Updates**: Confirm/reject glossary additions with checkboxes
5. **Complete**: Translation finished with updated glossary

## Project Structure

```
├── backend/
│   ├── main.py                 # FastAPI proxy server
│   ├── translate_graph/        # LangGraph workflow
│   └── langgraph.json         # LangGraph configuration
├── frontend/
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── services/          # API service layer
│   │   └── types/            # TypeScript definitions
│   └── index.css             # Silent Edge theme
└── start-dev.sh              # Development startup script
```

## Design System

Uses **Silent Edge** design principles:

- Minimalist, purposeful design
- Comfortable grayish whites (not harsh pure white)
- Dark grays (zinc-800/900 inspired)
- DaisyUI semantic classes for consistency
- Accessibility-first with WCAG AAA contrast

## Tech Stack

- **Backend**: FastAPI, LangGraph, Python 3.12
- **Frontend**: React, TypeScript, Vite, DaisyUI, Tailwind CSS
- **Translation**: Google Gemini 2.5 Flash Lite
- **State Management**: In-memory (no persistence)
