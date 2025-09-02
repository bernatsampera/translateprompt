"""In-memory cache for storing improvement tool calls by conversation ID."""

from typing import Any, Dict, List


class ImprovementToolCallsCache:
    """In-memory cache for improvement tool calls indexed by conversation ID."""

    def __init__(self):
        """Initialize the improvement tool calls cache."""
        self._cache: Dict[str, List[Any]] = {}

    def get_calls(self, conversation_id: str) -> List[Any]:
        """Get improvement tool calls for a conversation ID."""
        return self._cache.get(conversation_id, [])

    def add_calls(self, conversation_id: str, tool_calls: List[Any]) -> None:
        """Add improvement tool calls to existing ones for a conversation ID."""
        if conversation_id not in self._cache:
            self._cache[conversation_id] = []
        self._cache[conversation_id].extend(tool_calls)

    def remove_calls(
        self, conversation_id: str, filter_criteria: Dict[str, str]
    ) -> None:
        """Remove improvement tool calls that match filter criteria."""
        if conversation_id not in self._cache:
            return

        self._cache[conversation_id] = [
            call
            for call in self._cache[conversation_id]
            if not all(
                call.get("args", {}).get(key) == value
                for key, value in filter_criteria.items()
            )
        ]


# Global cache instance
improvement_cache = ImprovementToolCallsCache()
