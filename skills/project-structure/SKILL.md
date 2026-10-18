---
name: project-structure
description: Follow project structure conventions for monorepo setup, tech stack, and local development. Use when setting up new projects, configuring environments, or establishing code organization.
---

# Project Structure Skill

## Reference

Use https://github.com/travissmithv1/project-template for structure and patterns.

## Repository

- Monorepo structure
- Project-specific memory file in each folder
- Memory files added to .gitignore
- No cross-project information mixing

## Tech Stack

- TypeScript
- Jest for unit/integration tests
- Playwright for acceptance tests
- styled-components for CSS
- Vite for bundling
- No Redux

## Infrastructure

- Terraform modules
- GitHub Actions for CI/CD
- AWS ECS/S3/CloudFront
- Postgres database

## Local Development

- Docker for Postgres
- Database recreated on each start
- Seeded data for testing
- Easy login as seeded user types

## Environments

- Start with QA environment
- Support adding future environments
- Feature flags toggleable per environment

## README Requirements

- Local setup instructions
- Dependency installation steps
- How to run application locally
- How to run all tests
- How to determine test coverage
- Tech stack overview

## Shell Scripts

- Script for running linter
- Script for running tests

## Code Style

- ESLint with TypeScript
- Prettier for formatting
- Match existing file formatting exactly

## Frontend

- Server-side rendering preferred
- Dark/light mode support
- Responsive design (desktop/tablet/mobile)
- Accessibility support
- rem over px
- Localization ready (American English, US Dollar, US imperial)

## Assets

- Images saved to S3
- Tiny URLs for image links

## API

- Health endpoint required
- Type safety throughout codebase

## Dependencies

- Prefer custom code over dependencies
- Exception: widely adopted community packages