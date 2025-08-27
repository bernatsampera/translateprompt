# Database Package

This package provides a centralized database management system for the application, handling multiple types of data including glossary entries and user IP tracking.

## Structure

### `connection.py`

- **DatabaseConnection**: Core database connection management
- Connection pooling and context management
- Database initialization with all required tables
- Generic query execution methods

### `models.py`

- **GlossaryEntry**: Data class for glossary entries
- **UserIP**: Data class for user IP tracking
- Serialization/deserialization methods

### `schemas.py`

- **GLOSSARY_TABLE_SCHEMA**: Glossary entries table definition
- **GLOSSARY_INDEX_SCHEMA**: Glossary lookup index
- **USER_IP_TABLE_SCHEMA**: User IP tracking table definition
- Extensible for additional tables

### `glossary_operations.py`

- **GlossaryOperations**: Glossary-specific database operations
- CRUD operations for glossary entries
- Language pair filtering
- Backward compatibility methods

### `user_ip_operations.py`

- **UserIPOperations**: User IP tracking operations
- IP address management
- Token count tracking
- Analytics support

### `__init__.py`

- Package exports and initialization

## Usage

### Basic Database Connection

```python
from database import DatabaseConnection

# Initialize database connection
db = DatabaseConnection()

# Execute custom queries
rows = db.execute_query("SELECT * FROM glossary_entries WHERE source_language = ?", ("en",))
```

### Glossary Operations

```python
from database import GlossaryOperations
from database.models import GlossaryEntry

# Initialize glossary operations
glossary_ops = GlossaryOperations()

# Add a new entry
entry = GlossaryEntry(
    source_language="en",
    target_language="es",
    source_text="hello",
    target_text="hola",
    note="Greeting"
)
glossary_ops.add_entry(entry)

# Get all entries for a language pair
entries = glossary_ops.get_all_entries("en", "es")
```

### User IP Operations

```python
from database import UserIPOperations

# Initialize user IP operations
user_ip_ops = UserIPOperations()

# Track a new user IP
user_ip_ops.add_user_ip("192.168.1.1")

# Increment token count
user_ip_ops.increment_token_count("192.168.1.1", 10)

# Get user IP record
user_ip = user_ip_ops.get_user_ip("192.168.1.1")
```

## Database Schema

### Glossary Entries Table

```sql
CREATE TABLE glossary_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source_language TEXT NOT NULL,
    target_language TEXT NOT NULL,
    source_text TEXT NOT NULL,
    target_text TEXT NOT NULL,
    note TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(source_language, target_language, source_text)
)
```

### User IPs Table

```sql
CREATE TABLE user_ips (
    ip_address TEXT PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    token_count INTEGER DEFAULT 0
)
```

## Benefits

1. **Centralized Database Management**: Single point of control for all database operations
2. **Modular Design**: Separate operations classes for different data types
3. **Type Safety**: Strongly typed data models with validation
4. **Extensibility**: Easy to add new tables and operations
5. **Connection Pooling**: Efficient database connection management
6. **Error Handling**: Comprehensive error handling and logging
