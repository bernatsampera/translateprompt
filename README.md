# TranslatePrompt

AI-powered translation with interactive feedback and glossary management using LangGraph workflows.

## What it does

1. **User translates text** - Submit text with source/target languages
2. **AI provides initial translation** - Using LLM with existing glossary/rules
3. **User gives feedback** - Correct translation or provide specific guidance
4. **AI learns and improves** - Generates better translation + suggests glossary entries
5. **User confirms improvements** - Accept/reject glossary additions for future translations

## API Routes

- `POST /graphs/translate` - Start translation workflow
- `POST /graphs/refine-translation` - Provide feedback and get improved translation
- `GET /graphs/improvements/{id}` - Get suggested glossary/rule improvements
- `GET /glossary/glossary-entries` - Fetch user's glossary for language pair
- `POST /glossary/add-glossary-entry` - Manually add glossary entries

## Quick Start

```bash
# 1. Setup environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys (see Environment Setup section)

# 2. Setup environment and dependencies
make setup-env

# 3. Start development servers
make dev
```

**Access**: Frontend at http://localhost:5178, Backend at http://localhost:8008

> **Note**: Make sure to set your `OPENAI_API_KEY` in the `.env` file before starting the servers.

## Project Structure

```
├── backend/
│   ├── main.py                # FastAPI server
│   ├── translate_graph/       # LangGraph translation workflow
│   │   ├── index.py          # Main graph definition
│   │   ├── state.py          # Workflow state management
│   │   └── prompts.py        # Translation prompts
│   ├── routes/               # API endpoints
│   ├── database/             # SQLite database operations
│   ├── glossary/             # Glossary management
│   └── utils/                # Shared utilities
└── frontend/                 # React TypeScript UI
```

## Environment Setup

Create a `.env` file in the `backend/` directory based on `.env.example`:

```bash
# Copy the example environment file
cp backend/.env.example backend/.env
```

### Required Environment Variables

**Core Application:**

- `OPENAI_API_KEY` - Your OpenAI API key for LLM services
- `DATABASE_PATH` - Path to SQLite database file (e.g., `./database.db`)

**Authentication:**

- `BACKEND_URL` - Backend server URL (default: `http://localhost:8008`)
- `FRONTEND_URL` - Frontend server URL (default: `http://localhost:5178`)

### Optional Environment Variables

**LLM Configuration:**

- `GOOGLE_API_KEY` - Google API key for alternative LLM services
- `GOOGLE_LLM_MODEL` - Google LLM model name
- `OPEOPENAI_LLM_MODEL` - OpenAI model name (default: gpt-4)

**Production:**

- `PROD` - Set to `true` for production environment

**Authentication Services:**

- `SUPER_TOKENS_CONNECTION_URI` - SuperTokens connection URI
- `AXIOM_API_TOKEN` - Axiom API token for logging

**Development & Monitoring:**

- `LANGSMITH_ENDPOINT` - LangSmith API endpoint (default: `https://api.smith.langchain.com`)
- `LANGSMITH_API_KEY` - LangSmith API key for tracing
- `LANGSMITH_PROJECT` - LangSmith project name (default: `default`)

### Quick Environment Setup

```bash
# Set required variables
export OPENAI_API_KEY="your-openai-api-key"
export DATABASE_PATH="./database.db"

# Optional: Set for development
export LANGSMITH_API_KEY="your-langsmith-key"
export LANGSMITH_PROJECT="translateprompt-dev"
```
