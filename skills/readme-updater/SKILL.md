---
description: Create or update README files for a project — one at the repository root and one per application directory (api, web, mobile). Use when a README is missing, stale, or when asked to document how to run the app and its tests locally.
---

# README Skill

Ensure there is a README for each part of the application as necessary. For example, if there is an api, web, and mobile folder, each folder should have its own README file. Also ensure there is a README file at the root of the project.

The README files should be simple. They should explain how to run the application locally and also how to run the tests locally.

If the README files already exist, you should work to make sure they are up to date according to the latest state of the code and application.

## Excluded Folders

Do NOT create README files for the following folders:
- `infrastructure/` - Infrastructure-as-code managed separately

## Example README Files

Use the following as templates and adapt them to the specific project:

### Root README

**IMPORTANT:** The root README must be simple and minimal. Follow the exact format in `references/root-readme-template.md`. Do NOT add:
- Technology stack tables
- Detailed project structure trees
- Testing sections
- License sections
- Prerequisites sections
- Documentation links

The root README should only contain:
1. Application name and brief description
2. Overview listing the main directories (frontend/backend)
3. Simple instructions pointing to subdirectory READMEs for running locally

### API README

**IMPORTANT:** The API README must be simple and minimal. Follow the exact format in `references/api-readme-template.md`. Do NOT add:
- Architecture diagrams or layer descriptions
- Environment variable tables
- API endpoint documentation
- Docker instructions
- Prerequisites sections

The API README should only contain:
1. Project name and brief description
2. How to run the application locally
3. How to run the tests locally

### Web App README

**IMPORTANT:** The web README must be simple and minimal. Follow the exact format in `references/web-readme-template.md`. Do NOT add:
- Build instructions
- Linting commands
- Technology descriptions
- Component documentation

The web README should only contain:
1. Project name and brief description
2. How to set up the local environment
3. How to run the application locally
4. How to run the tests locally

### Mobile App README

**IMPORTANT:** The mobile README must be simple and minimal. Follow the exact format in `references/mobile-readme-template.md`. Do NOT add:
- Build configurations
- Deployment instructions
- Platform-specific documentation links
- Dependency explanations

The mobile README should only contain:
1. Project name and brief description
2. How to set up the local environment
3. How to run the application locally (iOS and Android sections)
4. How to run the tests locally (iOS and Android sections)
