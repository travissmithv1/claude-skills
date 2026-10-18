---
name: automated-testing
description: Apply automated testing best practices including the testing pyramid, unit tests, integration tests, and acceptance tests. Use when writing tests, reviewing test coverage, or establishing testing strategy.
---

# Automated Testing Skill

## Testing Pyramid

Prioritize many unit tests, fewer integration tests, minimal acceptance tests.

## Unit Tests

- Each test has exactly one assertion
- Tests run in isolation
- Tests are deterministic
- Tests run fast (under 1/10 second)
- Cover all functionality except infrastructure/config

## Integration Tests

- Fewer than unit tests
- Test component boundaries
- Still isolated and deterministic

## Acceptance Tests

- Minimal quantity
- Focus on happy paths only
- End-to-end validation

## What to Test

- Explicit exceptions
- Business logic
- Data transformations
- Edge cases

## What Not to Test

- Logging
- CSS
- Infrastructure configuration

## Test Data

- Prefer real data over test doubles
- Use seeded data for local development
- Database recreated on each local start

## Test Requirements

- All tests pass before any commit
- Failing tests must fail for correct reasons
- Never ignore test output - contains critical information
- Tests automatically run before each commit
- Don't run all tests for a project unless explicitly told to

## Handling Failing Tests

- Don't assume failing tests are flaky or pre-existing
- If a test is failing locally, it's almost always related to changes recently made
- Try first reverting recent changes and running the tests again
- Ask for directions if unsure how to address failing tests
- Don't ignore failing tests whatsoever

## Test Frameworks

- Jest for JavaScript/TypeScript unit and integration tests
- Playwright for acceptance tests
- xUnit for .NET applications

## Feature Flag Testing

- Test behavior when flag is on
- Test behavior when flag is off
- Both scenarios required for flag-controlled features