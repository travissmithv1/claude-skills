---
name: xunit-test-patterns
description: Test design guidance based on Gerard Meszaros's "xUnit Test Patterns". Use when writing new tests, reviewing existing tests, refactoring test code, identifying test smells, or discussing test design principles. Covers test smells and their causes, test double patterns (stubs, mocks, fakes, spies), fixture management, result verification, test organization, and the philosophy of writing maintainable tests.
---

# xUnit Test Patterns

Guidance for writing maintainable, readable automated tests based on Gerard Meszaros's patterns.

## Core Principles

**Tests as Documentation**: Tests specify expected behavior. Prioritize readability over DRY.

**Four-Phase Test**: Every test follows: Setup → Exercise → Verify → Teardown

**Fresh Fixture**: Each test creates its own fixture. Avoid shared state between tests.

**Single Condition per Test**: Test one logical concept. Multiple assertions are fine if verifying one outcome.

## Quick Reference

| Situation | Reference |
|-----------|-----------|
| Test is hard to understand | [test-smells.md](references/test-smells.md) - Obscure Test section |
| Test fails unpredictably | [test-smells.md](references/test-smells.md) - Erratic Test section |
| Tests are slow | [test-smells.md](references/test-smells.md) - Slow Tests section |
| Tests break when code changes | [test-smells.md](references/test-smells.md) - Fragile Test section |
| Need to isolate dependencies | [test-doubles.md](references/test-doubles.md) |
| Setting up test data | [fixture-patterns.md](references/fixture-patterns.md) |
| Verifying results | [verification-patterns.md](references/verification-patterns.md) |
| Organizing test code | [organization-patterns.md](references/organization-patterns.md) |

## Test Smell Diagnosis

When reviewing tests, check for these smell categories:

1. **Code Smells** - Problems visible in test code structure
2. **Behavior Smells** - Problems visible when running tests
3. **Project Smells** - Problems visible at project/team level

See [test-smells.md](references/test-smells.md) for detailed diagnosis and refactoring guidance.

## Test Double Selection

```
Need to control indirect inputs?     → Stub
Need to verify indirect outputs?     → Mock / Spy  
Need a working implementation?       → Fake
Need to capture for later verify?    → Spy
```

See [test-doubles.md](references/test-doubles.md) for patterns and usage guidance.