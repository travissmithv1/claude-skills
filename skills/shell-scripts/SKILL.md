---
description: Create the project's helper shell scripts (run_api.sh, run_web.sh, run_mobile.sh and similar) for starting each application directory locally. Use when setting up a new project's local development scripts or asked for a run script.
---

# Shell Scripts Skill

Create shell scripts for project directories (api, web, mobile) as needed.

## run_api.sh

Create a `run_api.sh` script in the api directory if it exists. This script starts the API server in a Docker container.

**IMPORTANT:** Follow the exact format in `references/run_api.sh`. The script should:
1. Use `set -e` to exit on errors
2. Define STEP_DIVIDER variable
3. Parse command line flags:
   - `-f`: Full start (install dependencies)
   - `-r`: Rebuild Docker image before starting
4. Clean temporary files
5. Start the database container
6. Wait for database to be ready
7. Install dependencies (if `-f` flag provided)
8. Run database migrations
9. Build Docker image (if `-r` flag provided)
10. Start the API in a Docker container
11. Echo success message with API URL

Replace placeholders based on the project's tech stack:

**Database docker-compose:**
- `[path/to/db.docker-compose.yaml]` - Path to database docker-compose file

**Database readiness check:**
- PostgreSQL: `while ! pg_isready -h localhost | grep 'accepting connections' 1> /dev/null; do sleep 1; done`
- MySQL: `while ! mysqladmin ping -h localhost --silent; do sleep 1; done`
- MongoDB: `while ! mongosh --eval "db.adminCommand('ping')" --quiet; do sleep 1; done`

**Dependency installation:**
- Node.js: `npm install` or `yarn install`
- Python (pipenv): `pipenv install --dev`
- Python (pip): `pip install -r requirements.txt`
- Go: `go mod download`

**Database migrations:**
- Django: `pipenv run python manage.py migrate` or `python manage.py migrate`
- Node.js (Prisma): `npx prisma migrate deploy`
- Node.js (Knex): `npx knex migrate:latest`
- Go (golang-migrate): `migrate -path ./migrations -database "$DATABASE_URL" up`

**Docker configuration:**
- `[image-name]` - Name for the Docker image (e.g., `myapp-api`)
- `[path/to/Dockerfile]` - Path to the API Dockerfile
- `[path/to/api.docker-compose.yaml]` - Path to API docker-compose file
- `[port]` - Port the API runs on (e.g., `8080`, `3000`)

## run_linter.sh

Create a `run_linter.sh` script in each project directory (api, web, mobile) if the directory exists.

**IMPORTANT:** Follow the exact format in `references/run_linter.sh`. The script should:
1. Use `set -e` to exit on errors
2. Echo a step divider
3. Echo "Running Linter"
4. Run the appropriate lint command for that directory
5. Echo a success message with checkmark

Replace `[Command to run linter]` with the actual lint command for the project:
- For Node.js projects: `npm run lint`
- For Python projects: `ruff check .` or `flake8 .`
- For Go projects: `golangci-lint run`

Adapt the command based on what's configured in the project's package.json, pyproject.toml, or equivalent config file.

## run_unit_tests.sh

Create a `run_unit_tests.sh` script in each project directory (api, web, mobile) if the directory exists.

**IMPORTANT:** Follow the exact format in `references/run_unit_tests.sh`. The script should:
1. Use `set -e` to exit on errors
2. Define STEP_DIVIDER variable
3. Echo a step divider
4. Echo "Running Unit & Integration Tests"
5. Navigate to the test directory if needed
6. Run the appropriate test command for that directory
7. Navigate back to parent directory
8. Echo a success message with checkmark

Replace `[Command to run tests]` with the actual test command for the project:
- For Node.js projects: `npm test` or `npm run test:unit`
- For Python projects: `pytest`
- For Go projects: `go test ./...`

Adapt the command based on what's configured in the project's package.json, pyproject.toml, or equivalent config file.

## run_e2e_tests.sh

Create a `run_e2e_tests.sh` script in each project directory (web, mobile) if the directory exists. This is typically not needed for api directories.

**IMPORTANT:** Follow the exact format in `references/run_e2e_tests.sh`. The script should:
1. Use `set -e` to exit on errors
2. Define STEP_DIVIDER variable
3. Echo a step divider
4. Echo "Running End-to-End Tests"
5. Navigate to the test directory if needed
6. Run the appropriate E2E test command for that directory
7. Navigate back to parent directory
8. Echo a success message with checkmark

Replace `[Command to run tests]` with the actual E2E test command for the project:
- For Playwright projects: `npx playwright test`
- For Cypress projects: `npx cypress run`
- For Detox (mobile): `detox test`

Adapt the command based on what's configured in the project's package.json or equivalent config file.

## run_tests.sh

Create a `run_tests.sh` script in each project directory (api, web, mobile) if the directory exists. This is the main entry point that runs all tests.

**IMPORTANT:** Follow the exact format in `references/run_tests.sh`. The script should:
1. Use `set -e` to exit on errors
2. Define STEP_DIVIDER variable
3. Source and run `run_linter.sh`
4. Source and run `run_unit_tests.sh`
5. Source and run `run_e2e_tests.sh` (if applicable for that directory)
6. Echo a final success or failure message with emojis

For api directories, omit the `run_e2e_tests.sh` step if E2E tests are not applicable.
