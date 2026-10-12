---
name: github-actions-cicd
description: CI/CD deployment pipelines using GitHub Actions for AWS. Use when creating deployment workflows, setting up build pipelines, configuring GitHub environments, or deploying to AWS via OIDC.
---

# GitHub Actions CI/CD

## Workflow File
- Name: `.github/workflows/build-test-deploy.yml`

## Pipeline Order
1. Lint and test (parallel where possible)
2. Build applications
3. Run E2E tests (if applicable)
4. Push artifacts (container images, static files, etc.)
5. Deploy to environment

## AWS Authentication
- OIDC connection from GitHub to AWS
- IAM role ARN stored as repository secret (shared across environments)
- No long-lived AWS credentials

## Setup Scripts
Create shell scripts in `scripts/` directory:
- `setup-aws-oidc.sh` — Creates OIDC providers and IAM roles
- `setup-github-environment.sh` — Creates GitHub environments and sets variables

See [examples/setup-aws-oidc.sh](examples/setup-aws-oidc.sh) and [examples/setup-github-environment.sh](examples/setup-github-environment.sh) for reference implementations.

## Script Configuration Values
Always prompt the user for these values — never use hardcoded values from examples:
- AWS Account ID
- GitHub repository (owner/repo format)
- Environment name (e.g., qa, production)
- Project/application name prefix
- AWS region
- Any Terraform outputs needed for deployment

## GitHub Environment Setup Script
- Uses GitHub CLI (gh) to configure repository
- Prompts for Terraform output values relevant to the project
- Creates environment if it doesn't exist
- Sets repository secrets (shared across environments)
- Sets environment-specific variables
- Requires: `gh auth login` before running

## GitHub Configuration
- Repository secrets: values shared across all environments (e.g., AWS_ROLE_ARN)
- Environment variables: environment-specific values from Terraform outputs
- Environments configured via setup script or GitHub UI

## ECS Deployment (if using ECS)
- Use task definition JSON file with placeholders
- Placeholders use format: VARIABLE_NAME_PLACEHOLDER
- Workflow replaces placeholders with GitHub environment variables
- Separate task definitions generated per environment at deploy time

## S3/CloudFront Deployment (if using static hosting)
- Sync build output to S3 bucket
- Invalidate CloudFront cache after deployment

## Lambda Deployment (if using Lambda)
- Package and upload function code
- Update function configuration as needed

## Secrets Configuration (if using Secrets Manager)
- Store secret ARNs in GitHub environment variables
- Reference secrets via ARN in deployment configuration
- ARNs come from Terraform outputs

## Health Checks (if using containers)
- Match health check command to base image
- Alpine-based: use wget (curl not available)
- Debian/Ubuntu-based: use curl

## Database Migrations (if applicable)
- Run migrations on container startup via entry point script
- Ensures migrations complete before health check passes

## E2E Tests
- Start application server before running tests
- Wait for server to be ready before test execution
- Use `start-server-and-test` or equivalent
- Ensure server runs in background and is killed after tests complete

## E2E Tests Database Configuration (if using PostgreSQL service container)
- GitHub Actions PostgreSQL service container does not support SSL
- If app requires SSL in production/QA, set NODE_ENV=test for E2E job
- This disables SSL for CI database connections

## Build Configuration (if frontend needs backend URL)
- Inject API URL from GitHub environment variables at build time
- Pass as build arg or environment variable during build step

## Container Registry Strategy (if using ECR or other registry)
- Registry can be environment-independent or per-environment
- Tag images with git SHA and/or environment name

## Caching
- Cache package manager dependencies (npm, yarn, pip, etc.)
- Cache Docker layers (if building images)
- Cache test browsers for E2E tests (if applicable)

## Workflow Triggers
- Push to main: deploy to first environment (e.g., QA)
- Manual dispatch: select environment

## Constraints
- No Terraform integration in GitHub Actions
- Infrastructure managed separately via Terraform Cloud
- GitHub only handles build/test/deploy