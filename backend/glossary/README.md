# Glossary Management System

This directory contains the refactored glossary management system, separated into focused modules for better maintainability.

## Structure

### `models.py`

- **GlossaryEntry**: Data class representing a glossary entry
- **Database schema definitions**: SQL table and index creation statements

### `database.py`

- **GlossaryDatabase**: Handles all SQLite database operations
- Connection management with context managers
- CRUD operations for glossary entries
- Error handling and logging

### `manager.py`

- **GlossaryManager**: High-level interface for glossary operations
- Production mode validation
- Business logic and validation
- Backward compatibility methods

### `__init__.py`

- Package initialization and exports
- Clean import interface

## Usage

```python
from glossary import GlossaryManager

# Initialize the manager
glossary_manager = GlossaryManager()

# Add a new entry
glossary_manager.add_source("hello", "hola", "en", "es", "Greeting")

# Get all entries
entries = glossary_manager.get_all_sources("en", "es")

# Get a specific entry
entry = glossary_manager.get_source("hello", "en", "es")
```

## Migration from translate_graph

The glossary system has been moved from `translate_graph/glossary_manager.py` to this dedicated directory. All imports have been updated to use the new structure:

- Old: `from translate_graph.glossary_manager import GlossaryManager`
- New: `from glossary import GlossaryManager`

## Files Moved

- `glossary.db`: SQLite database file
- `glossary.json`: Configuration/data file

## Benefits of the New Structure

1. **Separation of Concerns**: Models, database operations, and business logic are now separate
2. **Better Maintainability**: Each file has a single responsibility
3. **Improved Testability**: Individual components can be tested in isolation
4. **Cleaner Imports**: Dedicated package with clear exports
5. **Future Extensibility**: Easy to add new features or modify existing ones
