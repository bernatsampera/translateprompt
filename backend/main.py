"""Translation API with background glossary improvement analysis."""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supertokens_python.framework.fastapi import get_middleware

from config import config
from routes import (
    auth_endpoints,
    glossary_endpoints,
    graph_endpoints,
    waitlist_endpoints,
)

app = FastAPI(
    title="TranslatePrompt",
    description="Translateprompt is a site that allows users to translate with a glossary",
    version="1.0.0",
)

app.add_middleware(get_middleware())

# Add CORS middleware before defining routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

if __name__ == "__main__":
    uvicorn.run(
        "main:app", host=config.API_HOST, port=config.API_PORT, reload=config.API_RELOAD
    )
