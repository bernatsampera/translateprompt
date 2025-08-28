"""Routes package for the translation API."""

from .glossary_endpoints import router as glossary_router
from .graph_endpoints import router as graph_router
from .waitlist_endpoints import router as waitlist_router

__all__ = ["graph_router", "glossary_router", "waitlist_router"]
