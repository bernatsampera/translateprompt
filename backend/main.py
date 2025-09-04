"""Translation API with background glossary improvement analysis."""

from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supertokens_python import get_all_cors_headers
from supertokens_python.framework.fastapi import get_middleware

from config import config
from database.connection import initialize_database
from routes import (
    auth_endpoints,
    glossary_endpoints,
    graph_endpoints,
    pricing_endpoints,
    rules_endpoints,
    waitlist_endpoints,
)
from utils.logger import logger


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup
    initialize_database()
    logger.info("Server initialised")
    yield
    # Shutdown (if any cleanup is needed in the future)


app = FastAPI(
    title="TranslatePrompt",
    description="Translateprompt is a site that allows users to translate with a glossary",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(get_middleware())

# Add CORS middleware before defining routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.FRONTEND_URL,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["Content-Type"] + get_all_cors_headers(),
)


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok"}


# Include routers
app.include_router(graph_endpoints.router)
app.include_router(glossary_endpoints.router)
app.include_router(waitlist_endpoints.router)
app.include_router(auth_endpoints.router)
app.include_router(rules_endpoints.router)
app.include_router(pricing_endpoints.router)
if __name__ == "__main__":
    uvicorn.run(
        "main:app", host=config.API_HOST, port=config.API_PORT, reload=config.API_RELOAD
    )
