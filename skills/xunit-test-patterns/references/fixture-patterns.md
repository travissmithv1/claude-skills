# Fixture Patterns

## Table of Contents
- [Fixture Strategies](#fixture-strategies)
- [Fixture Setup Patterns](#fixture-setup-patterns)
- [Fixture Teardown Patterns](#fixture-teardown-patterns)

---

## Fixture Strategies

### Fresh Fixture
Each test creates its own fixture from scratch.

```
Pros: Tests are isolated; no interaction between tests
Cons: Slower; more setup code
When: Default choice; use unless proven slow
```

**Implementation:**
- Inline Setup: Create fixture directly in test method
- Delegated Setup: Call Creation Methods or Test Helpers
- Implicit Setup: Use framework's setUp/beforeEach

### Shared Fixture
Multiple tests use the same fixture instance.

```
Pros: Faster setup; less resource usage
Cons: Risk of Interacting Tests; harder to understand
When: Fixture is expensive AND immutable
```

**Safe sharing patterns:**
- **Immutable Shared Fixture**: Read-only data all tests can use
- **Lazy Setup**: Initialize shared fixture on first use

**Dangerous patterns:**
- Mutable shared fixture (tests modify it)
- Shared fixture with implicit dependencies

### Minimal Fixture
Create only what the specific test needs.

```
Pros: Tests are focused; clear what matters; faster
Cons: May miss integration issues
When: Always - General Fixture is a smell
```

Avoid General Fixture where setup creates objects "just in case."

---

## Fixture Setup Patterns

### Inline Setup
Fixture created directly in test method.

```
Pros: Everything visible in one place
Cons: Duplication; verbose; obscures intent
When: Simple fixtures; unique setup per test
```

```
// Example structure
test() {
    // Setup
    user = new User("test@example.com")
    order = new Order(user, today())
    
    // Exercise
    result = order.submit()
    
    // Verify
    assert result.isSuccess()
}
```

### Delegated Setup
Test calls helper methods to create fixture.

```
Pros: Reusable; DRY; intention-revealing names
Cons: Setup not visible in test; indirection
When: Same fixture needed across multiple tests
```

### Implicit Setup
Framework automatically calls setup before each test.

```
Pros: Consistent setup; no duplication
Cons: Hidden from test reader; may create General Fixture
When: Common fixtures across test class
```

Use setUp/beforeEach for fixtures used by ALL tests in class.
Use helper methods for fixtures used by SOME tests.

### Creation Method
Factory method that creates test objects with sensible defaults.

```
Pros: Encapsulates construction; allows defaults; intention-revealing
Cons: May hide important details; indirection
When: Object construction is complex or repeated
```

**Patterns:**
- **Anonymous Creation Method**: Creates object with default values
  ```
  createUser()  // uses defaults for all attributes
  ```

- **Parameterized Creation Method**: Accepts values relevant to test
  ```
  createUser(email: "test@test.com")  // specify what matters
  ```

- **One-Click Creation**: Creates complete valid object graph
  ```
  createOrderWithItems()  // creates user, order, line items
  ```

**Guidelines:**
- Only expose parameters tests actually vary
- Use sensible, valid defaults
- Name to reveal intent: `createExpiredSubscription()` not `createSubscription(expired: true)`

### Object Mother
Centralized factory class for test fixtures.

```
Pros: Single location for fixture creation; consistency
Cons: Can become bloated; may encourage General Fixture
When: Large test suite with common domain objects
```

```
class TestUsers {
    static basic() { return new User("user@test.com") }
    static admin() { return new User("admin@test.com", role: ADMIN) }
    static expired() { return new User("expired@test.com", expiry: yesterday()) }
}
```

### Test Data Builder
Fluent interface for constructing test objects.

```
Pros: Readable; flexible; composable
Cons: More infrastructure code
When: Objects have many optional attributes
```

```
user = UserBuilder.aUser()
    .withEmail("test@example.com")
    .withRole(ADMIN)
    .withExpiredSubscription()
    .build()
```

**Builder Guidelines:**
- Provide sensible defaults
- Chain methods return builder
- `build()` returns constructed object
- Support common scenarios with shorthand methods

---

## Fixture Teardown Patterns

### Garbage-Collected Teardown
Let language runtime clean up fixture.

```
When: Fixture is all in-memory with no external resources
```

Most unit tests need no explicit teardown.

### Automated Teardown
Framework automatically calls cleanup after each test.

```
When: Tests allocate resources that must be released
```

Use tearDown/afterEach for:
- Closing connections
- Deleting files
- Resetting singletons/global state

### Inline Teardown
Cleanup logic directly in test method.

```
When: Specific test has unique cleanup needs
```

Consider try/finally or language-specific cleanup mechanisms.

### Table Truncation Teardown
Clear database tables between tests.

```
When: Tests write to shared database
Better: Use Fresh Fixture with in-memory DB
```

---

## Fixture Anti-Patterns

### General Fixture
Setup creates more than any single test needs.

**Symptoms:**
- Large setUp method
- Tests only use subset of fixture
- Changing fixture breaks unrelated tests

**Fix:** Extract to Creation Methods; setup only what's needed.

### Prebuilt Fixture
External process creates fixture before tests run.

**Symptoms:**
- Tests depend on scripts or manual setup
- "Works on my machine" syndrome
- Unclear what state tests expect

**Fix:** Make fixtures self-contained; create in test or setUp.

### Mystery Guest
Fixture comes from external resource not visible in test.

**Symptoms:**
- Test references data without creating it
- External files, database seeds, environment variables
- Unclear where test data comes from

**Fix:** Make dependencies explicit; create data in test or visible helper.