# Backend Deployment Guide

## Local Development

```bash
# Build the Docker image
docker build -t translateprompt-backend .

# Run locally
docker run -p 8008:8008 \
  -e LLM_API_KEY=your_api_key_here \
  translateprompt-backend
```

Access the API at `http://localhost:8008`

## Server Deployment

### 1. Build and Deploy

```bash
# Build for production
docker build -t translateprompt-backend .

# Run on server
docker run -d \
  --name translateprompt-api \
  -p 8008:8008 \
  -e PROD=true \
  -e LLM_API_KEY=your_api_key_here \
  -e CORS_ORIGINS=https://yourdomain.com \
  --restart unless-stopped \
  translateprompt-backend
```

### 2. Environment Variables

- `LLM_API_KEY`: Required - Your LLM provider API key
- `PROD`: Set to `true` for production
- `CORS_ORIGINS`: Comma-separated list of allowed origins
- `DATABASE_PATH`: Optional - Custom database location

### 3. Health Check

```bash
curl http://your-server:8008/api/v1/hello
```

The API will be available at `http://your-server:8008`
