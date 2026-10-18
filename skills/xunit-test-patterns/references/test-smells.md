# Test Smells

## Table of Contents
- [Code Smells](#code-smells)
- [Behavior Smells](#behavior-smells)
- [Project Smells](#project-smells)

---

## Code Smells

### Obscure Test
Test is hard to understand at a glance.

**Causes:**
- **Eager Test**: Tests too many things at once
- **Mystery Guest**: Uses external resources/fixtures not visible in test
- **General Fixture**: Setup creates more than test needs
- **Irrelevant Information**: Test contains details unrelated to what's being tested
- **Hard-Coded Test Data**: Magic values without explanation
- **Indirect Testing**: Tests SUT through another object

**Refactoring:**
- Extract setup to intention-revealing helper methods
- Use Creation Methods with meaningful names
- Remove irrelevant setup details
- Name test data to reveal intent: `expiredDate` not `date1`
- Test the object directly, not through collaborators

### Conditional Test Logic
Test contains if/else, loops, or try/catch.

**Why it's bad:** Tests should be linear and predictable. Conditional logic means:
- Test may not execute assertions
- Multiple paths make test harder to understand
- Possible to hide bugs in untaken branches

**Refactoring:**
- Split into multiple tests (one per condition)
- Move conditionals to helper methods
- Use parameterized tests for data variations
- Replace try/catch with framework's expected exception mechanism

### Hard-to-Test Code
SUT design makes testing difficult.

**Causes:**
- Highly coupled code
- Asynchronous code
- Untestable Test Code (test helpers that are themselves buggy)

**Refactoring:**
- Introduce dependency injection
- Extract collaborator interfaces
- Use Test Doubles to control async behavior
- Apply Humble Object pattern: push logic out of hard-to-test locations

### Test Code Duplication
Same setup/verify logic repeated across tests.

**Refactoring:**
- Extract Test Utility Methods
- Use Custom Assertions for domain-specific verification
- Create Parameterized Tests for variations on same scenario
- Apply Creation Methods for fixture setup

### Test Logic in Production
Production code has test-specific branches or flags.

**Why it's bad:** Production code should be unaware of tests. Test hooks create:
- Risk of test code executing in production
- Coupling between test and implementation
- Maintenance burden

**Refactoring:**
- Use dependency injection instead of flags
- Extract interfaces for test substitution
- Apply Test Double patterns

---

## Behavior Smells

### Erratic Test
Test sometimes passes, sometimes fails without code changes.

**Causes:**
- **Interacting Tests**: Tests share state; order matters
- **Interacting Test Suites**: Suites pollute shared resources
- **Lonely Test**: Passes alone, fails in suite (or vice versa)
- **Resource Leakage**: Tests don't clean up resources
- **Resource Optimism**: Assumes resource exists/state
- **Unrepeatable Test**: Depends on external state (time, network, etc.)
- **Test Run War**: Multiple test runs interfere (shared DB, files)

**Refactoring:**
- Use Fresh Fixture pattern - each test creates its own state
- Implement proper teardown/cleanup
- Isolate tests from shared resources
- Use Test Doubles for external dependencies
- Make tests deterministic by controlling all inputs

### Fragile Test
Test breaks when unrelated code changes.

**Causes:**
- **Interface Sensitivity**: Tests internal APIs, not public contracts
- **Behavior Sensitivity**: Tests implementation details
- **Data Sensitivity**: Tests specific data values that may change
- **Context Sensitivity**: Tests depend on environment details

**Refactoring:**
- Test through public interfaces only
- Verify outcomes, not implementation steps
- Use flexible assertions (contains vs. equals)
- Abstract environment dependencies

### Assertion Roulette
Test has multiple assertions; unclear which failed.

**Refactoring:**
- One logical assertion per test
- Use assertion messages
- Extract to multiple focused tests
- Use Custom Assertions that report clearly

### Frequent Debugging
Tests fail but don't point to the problem.

**Causes:**
- Poor assertion messages
- Testing at wrong level of abstraction
- Missing intermediate assertions

**Refactoring:**
- Add descriptive failure messages
- Test at appropriate granularity
- Use smaller, focused tests

### Manual Intervention
Tests require human action to run.

**Refactoring:**
- Automate all setup/teardown
- Use Test Doubles for external systems
- Create self-contained fixtures

### Slow Tests
Tests take too long to run.

**Causes:**
- Too many real dependencies (DB, network, filesystem)
- Inefficient fixture setup
- Testing at wrong level (integration vs. unit)
- General Fixture creating unused objects

**Refactoring:**
- Use Test Doubles to eliminate I/O
- Move to in-memory alternatives
- Use Minimal Fixture - only what test needs
- Separate fast unit tests from slow integration tests
- Share immutable fixtures via Shared Fixture (carefully)

---

## Project Smells

### Buggy Tests
Tests themselves have bugs, causing false positives/negatives.

**Refactoring:**
- Keep test logic simple and linear
- Avoid Conditional Test Logic
- Review tests as carefully as production code
- Use well-tested Test Utility Methods

### Developers Not Writing Tests
Team avoids writing or running tests.

**Causes:**
- Tests are slow (Slow Tests)
- Tests are brittle (Fragile Test)
- Tests are hard to write (Hard-to-Test Code)
- Setup is complex

**Refactoring:**
- Address the root smell causing friction
- Make test infrastructure easy to use
- Provide good Creation Methods and fixtures
- Lead by example

### High Test Maintenance Cost
Significant time spent fixing broken tests.

**Root causes:**
- Fragile Tests
- Obscure Tests (hard to diagnose)
- Test Duplication (changes cascade)

**Refactoring:**
- Apply appropriate test patterns
- Improve test isolation
- Reduce duplication with utility methods

### Production Bugs
Bugs reach production despite tests.

**Causes:**
- Missing test coverage
- Tests at wrong granularity
- Tests verify implementation, not behavior

**Refactoring:**
- Write tests for bug before fixing
- Review what behavior is actually tested
- Focus on edge cases and error conditions