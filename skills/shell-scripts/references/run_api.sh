#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status

STEP_DIVIDER="***********************************************"

# Parse command line arguments
QUICK_START=1
REBUILD=0
while getopts fr flag
do
    case "${flag}" in
        f) QUICK_START=0;;
        r) REBUILD=1;;
        *)
    esac
done

echo "$STEP_DIVIDER"
echo "Cleaning temporary files"
rm -rf ./tmp/**/* 2>/dev/null || true

echo "$STEP_DIVIDER"
echo "Starting up database"
docker-compose -f [path/to/db.docker-compose.yaml] down 2>/dev/null || true
docker-compose -f [path/to/db.docker-compose.yaml] up -d

echo "$STEP_DIVIDER"
echo "Waiting for database to be ready"
[Command to check database readiness, e.g.: while ! pg_isready -h localhost | grep 'accepting connections' 1> /dev/null; do sleep 1; done]
echo "✅  Database is ready"

if [ $QUICK_START -eq 0 ]; then
    echo "$STEP_DIVIDER"
    echo "Installing dependencies"
    [Command to install dependencies, e.g.: npm install, pipenv install --dev, go mod download]
fi

echo "$STEP_DIVIDER"
echo "Running database migrations"
[Command to run migrations, e.g.: npm run migrate, pipenv run python manage.py migrate, go run cmd/migrate/main.go]
echo "✅  Migrations complete"

if [ $REBUILD -eq 1 ]; then
    echo "$STEP_DIVIDER"
    echo "Building Docker image"
    docker build -t [image-name] -f [path/to/Dockerfile] .
    echo "✅  Docker image built"
fi

echo "$STEP_DIVIDER"
echo "Starting API in Docker container"
docker-compose -f [path/to/api.docker-compose.yaml] down 2>/dev/null || true
docker-compose -f [path/to/api.docker-compose.yaml] up -d

echo "$STEP_DIVIDER"
echo "✅  API is running"
echo "🚀 Access the API at http://localhost:[port]"
echo ""
