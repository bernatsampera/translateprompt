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
# Setup environment and dependencies
make setup-env

# Start development servers
make dev
```

**Access**: Frontend at http://localhost:5178, Backend at http://localhost:8008

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

## Environment

Set your OpenAI API key:

```bash
export LLM_API_KEY="your-openai-api-key"
```
