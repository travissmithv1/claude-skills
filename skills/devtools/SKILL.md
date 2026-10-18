---
name: devtools
description: Add a dev tools panel to the login screen for local development. Use when setting up development utilities, auto-fill login, or feature flag toggles.
allowed-tools: Read, Grep, Glob, Bash, Task, Edit, Write
---

# Dev Tools Feature

Implement a dev tools panel for local development environments only.

## Requirements

### Location & Trigger
- Display a dev tools icon (wrench/gear icon) in the bottom-left corner of the login screen
- Icon should be subtle but visible (small, muted color)
- Clicking the icon opens a dev tools panel/modal

### Dev Tools Panel Features

#### 1. Auto-Populate Login Form
- Show a list of users from the seed data
- Each user should display: name, email, and role (admin/client)
- Clicking a user auto-fills the login form with their credentials
- Include common test users like admin and regular client users

#### 2. Feature Flags Toggle
- Display all available feature flags
- Show current state (on/off) for each flag
- Allow toggling flags on/off with a switch/checkbox
- Changes should persist in localStorage for the session
- Show flag name and brief description if available

### Environment Restriction (CRITICAL)
- Dev tools must ONLY be available in local environment
- Check environment variable (e.g., `NODE_ENV`, `VITE_ENV`, `REACT_APP_ENV`, or similar)
- Valid local indicators: `local`, `development`, `localhost`
- Must NOT appear in: `dev`, `qa`, `staging`, `production`, `prod`
- Use build-time or runtime environment checks as appropriate for the framework

## Implementation Guidelines

### UI/UX
- Panel should be a modal or slide-out drawer
- Include a close button
- Use existing design system components if available
- Keep styling consistent with the application

### Security Considerations
- Never include real credentials in production builds
- Seed data passwords should only be available in local builds
- Consider using environment variables for seed user credentials
- The entire dev tools component should be excluded from production bundles if possible

### Code Organization
- Create a dedicated DevTools component
- Keep feature flag logic separate and reusable
- Use conditional rendering based on environment

## Example Structure

```
src/
  components/
    DevTools/
      DevTools.tsx          # Main component with environment check
      DevToolsPanel.tsx     # The panel UI
      UserSelector.tsx      # User auto-fill list
      FeatureFlagToggle.tsx # Feature flag controls
      index.ts
```

## Environment Check Pattern

```typescript
const isLocalEnvironment = () => {
  const env = import.meta.env.VITE_ENV || import.meta.env.MODE || process.env.NODE_ENV;
  return ['local', 'development'].includes(env) ||
         window.location.hostname === 'localhost' ||
         window.location.hostname === '127.0.0.1';
};

// Only render if local
if (!isLocalEnvironment()) return null;
```

## Process

1. **Find the login page**: Locate the existing login screen component
2. **Identify seed data**: Find where seed/test users are defined
3. **Find feature flags**: Locate the feature flag service/configuration
4. **Check environment setup**: Understand how environments are configured
5. **Implement DevTools component**: Create the dev tools with environment restriction
6. **Add to login page**: Integrate the dev tools icon into the login screen
7. **Test**: Verify it works locally and confirm it won't appear in other environments
