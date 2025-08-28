FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy the entire backend application first
COPY . .

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app && chown -R app:app /app

# Create database directory with proper permissions
RUN mkdir -p /app/data && chown -R app:app /app/data

# Create volume mount point for database persistence
VOLUME ["/app/data"]

USER app

# Install Python dependencies
RUN pip install --no-cache-dir -e .

# Set PATH to include virtual environment
ENV PATH="/opt/venv/bin:$PATH"



# Expose the port
EXPOSE 8010

# Set environment variables
ENV API_HOST=0.0.0.0
ENV API_PORT=8010
ENV API_RELOAD=false
ENV PYTHONPATH=/app

# Command to run the application
CMD ["python", "main.py"]
