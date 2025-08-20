#!/bin/bash

echo "Starting GeoAI Python Backend..."

# Navigate to the geoai-api directory
cd services/geoai-api

# Install dependencies if requirements.txt is newer than the environment
if [ requirements.txt -nt .venv ] || [ ! -d .venv ]; then
    echo "Installing Python dependencies..."
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt
else
    source .venv/bin/activate
fi

# Start the FastAPI server
echo "Starting FastAPI server on http://localhost:8001"
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
