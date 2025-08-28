FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy the entire backend application first
COPY . .

# Install Python dependencies
RUN pip install --no-cache-dir -e .

# Create directory for database if it doesn't exist
RUN mkdir -p database

# Expose the port
EXPOSE 8010

# Set environment variables
ENV API_HOST=0.0.0.0
ENV API_PORT=8010
ENV API_RELOAD=false
ENV PYTHONPATH=/app

# Command to run the application
CMD ["python", "main.py"]
