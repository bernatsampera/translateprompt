"""Translation API with background glossary improvement analysis."""

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import config
from routes import glossary_endpoints, graph_endpoints

app = FastAPI(
    title="DocTranscriber",
    description="DocTranscriber is a tool that transcribes documents into a structured format.",
    version="1.0.0",
)

# Add CORS middleware before defining routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/hello")
def read_root():
    """Health check endpoint."""
    return {"message": "This comes from the backend"}


# Include routers
app.include_router(graph_endpoints.router)
app.include_router(glossary_endpoints.router)


if __name__ == "__main__":
    uvicorn.run(
        "main:app", host=config.API_HOST, port=config.API_PORT, reload=config.API_RELOAD
    )
