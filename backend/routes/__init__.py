"""Routes package for the translation API."""

from .auth_endpoints import router as auth_router
from .glossary_endpoints import router as glossary_router
from .graph_endpoints import router as graph_router
from .pricing_endpoints import router as pricing_router
from .rules_endpoints import router as rules_router
from .user_endpoints import router as user_router
from .waitlist_endpoints import router as waitlist_router

__all__ = [
    "graph_router",
    "glossary_router",
    "waitlist_router",
    "auth_router",
    "rules_router",
    "pricing_router",
    "user_router",
]
