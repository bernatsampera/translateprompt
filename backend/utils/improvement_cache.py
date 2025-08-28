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

    def set_calls(self, conversation_id: str, tool_calls: List[Any]) -> None:
        """Set improvement tool calls for a conversation ID (replaces existing)."""
        self._cache[conversation_id] = tool_calls

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

    def clear_conversation(self, conversation_id: str) -> None:
        """Clear all improvement tool calls for a conversation ID."""
        self._cache.pop(conversation_id, None)

    def clear_all(self) -> None:
        """Clear all cached improvement tool calls."""
        self._cache.clear()

    def get_active_conversations(self) -> List[str]:
        """Get list of conversation IDs that have cached improvement tool calls."""
        return list(self._cache.keys())

    def cleanup_empty_conversations(self) -> int:
        """Remove conversations with no tool calls. Returns number of cleaned up conversations."""
        empty_conversations = [
            conv_id for conv_id, calls in self._cache.items() if not calls
        ]
        for conv_id in empty_conversations:
            del self._cache[conv_id]
        return len(empty_conversations)


# Global cache instance
improvement_cache = ImprovementToolCallsCache()
