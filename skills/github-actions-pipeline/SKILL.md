---
description: Create a GitHub Actions build/test/deploy workflow at .github/workflows/build_test_deploy.yml, adapted to which of the api, web, and mobile directories the project actually has. Use when setting up CI for a new project, adding a build or deploy job, or asked for a GitHub Actions pipeline or workflow file.
---

# GitHub Actions Pipeline Skill

Create a GitHub Actions workflow file for building, testing, and deploying the application.

## build_test_deploy.yml

Create a `.github/workflows/build_test_deploy.yml` file based on the reference template in `references/build_test_deploy.yml`.

### Adapting for Project Structure

**IMPORTANT:** The workflow must be adapted based on which directories exist in the project:

#### If the project has `api` directory:
- Include the `build-and-test-api` job
- Include the `build-and-push-api-docker-qa` job
- Include the `deploy-api-qa` job
- Replace all `[placeholder]` values with actual commands for the API

#### If the project has `web` directory:
- Include the `build-and-test-web` job
- Include the `build-and-deploy-web-qa` job
- Replace all `[placeholder]` values with actual commands for the web app

#### If the project has `mobile` directory:
- Include the `build-and-test-mobile-ios` job
- Include the `build-and-test-mobile-android` job
- Replace all `[placeholder]` values with actual commands for the mobile app

#### If the project does NOT have a directory:
- Remove the corresponding jobs entirely
- Update the `needs` arrays in dependent jobs to remove references to removed jobs

### Job Dependencies

The workflow has the following job dependency structure:

1. `build-and-test-api` runs first
2. `build-and-test-web` needs `build-and-test-api`
3. `build-and-test-mobile-ios` needs `build-and-test-api`
4. `build-and-test-mobile-android` needs `build-and-test-api`
5. `build-and-push-api-docker-qa` needs all build-and-test jobs
6. `deploy-api-qa` needs `build-and-push-api-docker-qa`
7. `build-and-deploy-web-qa` needs `deploy-api-qa`

When removing jobs, update the `needs` arrays accordingly:
- If no mobile: Remove mobile jobs from `build-and-push-api-docker-qa` needs array
- If no web: Remove web job from `build-and-push-api-docker-qa` needs array and remove `build-and-deploy-web-qa` job
- If no api: The entire workflow structure changes significantly (web/mobile would need different test setup)

### Placeholder Values to Replace

Replace these placeholders with project-specific values:
- `[Cache config settings]` - Caching configuration for dependencies
- `[Restore dependencies command]` - Command to restore/install dependencies
- `[Publish API command]` - Command to build/publish the API
- `[API Startup command]` - Command to start the API server
- `[Localhost url and port]` - Local URL for health checks (e.g., `http://localhost:3000/health`)
- `[Out path]` - Output path for build artifacts
- `[Node version]` - Node.js version (e.g., `22`)
- `[Command for running api]` - Command to run the API in background
- `[Command for running web]` - Command to serve the web app
- `[Command for installing dependencies]` - Mobile dependency installation
- `[Command for building iOS app]` - iOS build command
- `[Command for restoring API dependencies]` - API dependency restore for mobile tests
- `[iPhone Version]` - iPhone model for simulator (e.g., `16 Pro`)
- `[Install dependencies command]` - Android dependency installation
- `[Build android app command]` - Android APK build command
- `[Android OS version]` - Android API level (e.g., `34`)
- `[Android Phone Version]` - Android device profile (e.g., `pixel_6`)
- `[Dockerfile path]` - Path to Dockerfile
- `[API path]` - Path to API source code
