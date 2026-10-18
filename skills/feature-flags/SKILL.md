---
name: feature-flags
description: Implement and manage feature flags for controlled rollouts. Use when adding toggleable features, testing with flags on/off, or managing feature availability across environments.
---

# Feature Flags Skill

## Purpose

Control feature availability without code deployments. Enable safe rollouts and testing.

## Implementation

- Easily toggled on/off for non-production environments
- Environment-specific configuration
- No hardcoded flag values in application code

## Naming

- Descriptive of the feature being controlled
- Never use "improved", "new", or "enhanced"
- Use consistent naming convention across codebase

## Testing Requirements

- Test behavior when flag is on
- Test behavior when flag is off
- Both scenarios required before commit
- Flag state must not affect test isolation

## TDD with Feature Flags

1. Write failing test with flag off (existing behavior)
2. Write failing test with flag on (new behavior)
3. Implement flag check
4. Implement new behavior behind flag
5. Refactor

## Default States

- Off in production until verified
- Configurable per environment
- QA environment used for initial testing

## Cleanup

- Remove flags after feature is stable
- Document flags scheduled for removal
- Treat long-lived flags as tech debt