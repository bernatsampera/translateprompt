# Glossary Management System

This directory contains the glossary management system, which provides a high-level interface for glossary operations.

## Structure

### `manager.py`

- **GlossaryManager**: High-level interface for glossary operations
- Production mode validation
- Business logic and validation
- Backward compatibility methods

### `__init__.py`

- Package initialization and exports
- Clean import interface

## Database Integration

The glossary system now uses the general database package (`../database/`) for all database operations:

- **Database Connection**: `../database/connection.py`
- **Glossary Operations**: `../database/glossary_operations.py`
- **Data Models**: `../database/models.py`
- **Schema Definitions**: `../database/schemas.py`

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

## Benefits of the New Structure

1. **Separation of Concerns**: Database operations are now handled by a dedicated database package
2. **Better Maintainability**: Each component has a single responsibility
3. **Improved Testability**: Individual components can be tested in isolation
4. **Cleaner Imports**: Dedicated package with clear exports
5. **Future Extensibility**: Easy to add new features or modify existing ones
6. **Shared Database**: Multiple systems can share the same database infrastructure
