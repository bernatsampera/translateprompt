.PHONY: help install install-backend install-frontend dev dev-backend dev-frontend dev-all clean setup-env activate-env test test-backend

# Default target
help:
	@echo "Available commands:"
	@echo "  setup-env       - Set up Python virtual environment and install dependencies"
	@echo "  activate-env    - Activate the virtual environment (for manual use)"
	@echo "  install         - Install dependencies for both backend and frontend"
	@echo "  install-backend - Install Python dependencies for backend"
	@echo "  install-frontend- Install Node.js dependencies for frontend"
	@echo "  dev-backend     - Run backend development server"
	@echo "  dev-frontend    - Run frontend development server"
	@echo "  dev             - Run both backend and frontend servers"
	@echo "  test-backend    - Run backend integration tests"
	@echo "  test            - Run all tests"
	@echo "  clean           - Clean up generated files"

# Set up Python virtual environment and install dependencies
setup-env:
	@echo "Setting up Python virtual environment..."
	cd backend && uv venv --python 3.11
	cd backend && uv sync
	@echo "Virtual environment setup complete!"
	@echo "To activate manually: source backend/.venv/bin/activate"

# Activate virtual environment (for manual use)
activate-env:
	@echo "Activating virtual environment..."
	@echo "Run: source backend/.venv/bin/activate"

# Install all dependencies
install: install-backend install-frontend

# Install backend dependencies
install-backend:
	@echo "Installing backend dependencies..."
	cd backend && uv sync

# Install frontend dependencies
install-frontend:
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Run backend development server
dev-backend:
	@echo "Starting backend server on http://localhost:8008"
	cd backend && source .venv/bin/activate && uvicorn main:app --reload --port 8008

# Run frontend development server
dev-frontend:
	@echo "Starting frontend server on http://localhost:5177"
	cd frontend && npm run dev

# Run both servers simultaneously
dev:
	@echo "Starting both backend and frontend servers..."
	@echo "Backend: http://localhost:8008"
	@echo "Frontend: http://localhost:5177"
	@make -j2 dev-backend dev-frontend

# Clean up generated files
clean:
	@echo "Cleaning up..."
	cd frontend && rm -rf node_modules dist
	cd backend && rm -rf __pycache__ .pytest_cache
	@echo "Cleanup complete"

# Run backend tests
test-backend:
	@echo "Running backend integration tests..."
	cd backend && python run_tests.py

# Run all tests
test: test-backend 