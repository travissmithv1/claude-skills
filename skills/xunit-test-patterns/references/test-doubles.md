# Test Double Patterns

## Table of Contents
- [Overview](#overview)
- [Test Double Types](#test-double-types)
- [Configuration Patterns](#configuration-patterns)
- [Usage Guidelines](#usage-guidelines)

---

## Overview

A **Test Double** replaces a production dependency during testing. Use test doubles to:
- Control indirect inputs to the SUT
- Verify indirect outputs from the SUT
- Speed up tests by eliminating slow dependencies
- Isolate the SUT from unreliable/unavailable components

### Terminology

- **SUT** (System Under Test): The code being tested
- **DOC** (Depended-On Component): A collaborator the SUT depends on
- **Indirect Input**: Data the SUT receives from a DOC
- **Indirect Output**: Data the SUT sends to a DOC

---

## Test Double Types

### Dummy Object
Object passed but never used. Satisfies parameter requirements.

```
When: Method requires a parameter but test doesn't exercise that code path
Example: Passing null or empty object to satisfy constructor
Risk: None - not exercised
```

### Test Stub
Provides canned answers to calls made during test. Controls indirect inputs.

```
When: Need to control what the DOC returns to the SUT
Example: Stubbing a repository to return specific test data
Risk: Stub may drift from real implementation behavior
```

**Variations:**
- **Responder**: Returns valid data for happy path
- **Saboteur**: Returns errors/exceptions to test error handling
- **Temporary Test Stub**: Placeholder until real implementation exists

### Test Spy
Records calls for later verification. Captures indirect outputs.

```
When: Need to verify what the SUT sent to the DOC
Example: Capturing arguments passed to a notification service
Risk: Couples test to implementation details
```

### Mock Object
Pre-programmed with expectations. Fails test if expectations not met.

```
When: Need to verify specific interactions with the DOC
Example: Verifying exact method call sequence
Risk: Over-specification; brittle tests; tests implementation not behavior
```

**Key distinction from Spy:**
- Mock: Fails automatically if expectation not met (verification during exercise)
- Spy: Requires explicit verification after exercise

### Fake Object
Working implementation with shortcuts unsuitable for production.

```
When: Need realistic behavior without production complexity
Example: In-memory database, fake payment gateway that always succeeds
Risk: Fake may behave differently than real implementation
```

**Common fakes:**
- In-memory database
- Fake file system
- Fake web service (returns canned responses)
- Fake random number generator (deterministic)

---

## Configuration Patterns

### Hard-Coded Test Double
Test double behavior is fixed in the double's implementation.

```
Pros: Simple, reusable across tests
Cons: New behavior requires new class; less flexible
When: Same behavior needed across many tests
```

### Configurable Test Double
Test double behavior is specified by each test.

```
Pros: Flexible; one double serves many scenarios
Cons: More complex setup in each test
When: Different tests need different behaviors
```

### Self-Initializing Fake
Records real behavior first run, replays on subsequent runs.

```
Pros: Guaranteed accuracy to real implementation
Cons: Must regenerate when real behavior changes
When: Real service is slow/unreliable but behavior is stable
```

---

## Usage Guidelines

### Choosing Between Stubs and Mocks

**Prefer Stubs when:**
- Controlling inputs to drive SUT to specific state
- Testing happy path scenarios
- DOC behavior is incidental to what you're testing

**Prefer Mocks/Spies when:**
- The interaction IS what you're testing (e.g., notification sent)
- Command methods with side effects
- Verifying correct delegation

### Mock Object Antipatterns

**Overspecification**: Testing exact sequence of calls, number of calls, or argument details that don't matter.

```
Bad:  verify(repo).findById(eq(42), any(), any())  // tests too much
Good: verify(repo).findById(42)                    // tests what matters
```

**Mocking Concrete Classes**: Creates coupling to implementation.

```
Bad:  mock(UserRepository.class)
Good: mock(UserRepositoryInterface.class)
```

**Excessive Mocking**: Too many mocks suggests:
- SUT has too many dependencies
- Testing at wrong level of abstraction
- Consider integration test instead

### State vs. Behavior Verification

**State Verification** (preferred): Assert on the outcome/state after exercise.
```
result = sut.process(input)
assert result == expectedValue
```

**Behavior Verification**: Assert on how the SUT interacted with DOCs.
```
sut.process(input)
verify(collaborator).wasCalled()
```

Behavior verification couples tests to implementation. Use sparingly for:
- Side effects that don't produce observable state
- Verifying important interactions (audit logging, notifications)

### Test Double Scope

**Per-test doubles**: Created fresh for each test. Preferred - no shared state.

**Shared doubles**: Reused across tests. Use only for:
- Immutable fakes (in-memory DB with no state)
- Expensive initialization (connection pools)

Ensure shared doubles reset state between tests.