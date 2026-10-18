# Result Verification Patterns

## Table of Contents
- [Verification Approaches](#verification-approaches)
- [Assertion Patterns](#assertion-patterns)
- [Delta Assertions](#delta-assertions)

---

## Verification Approaches

### State Verification
Assert on observable state after exercise.

```
Pros: Tests behavior, not implementation; resilient to refactoring
Cons: Some effects aren't visible as state
When: Default choice for most tests
```

```
// Example: verify result state
result = calculator.add(2, 3)
assert result == 5

// Example: verify SUT state
cart.addItem(product)
assert cart.itemCount == 1
```

### Behavior Verification
Assert on interactions between SUT and DOCs.

```
Pros: Can verify side effects; tests delegation
Cons: Couples to implementation; fragile
When: Side effects are the behavior being tested
```

```
// Example: verify notification was sent
sut.completeOrder(order)
verify(notificationService).sendConfirmation(order.customer)
```

Use behavior verification sparingly - prefer state verification.

### Output Verification
Assert on values returned by SUT.

```
When: Method returns meaningful result
```

Simplest form of state verification.

### Stored State Verification
Assert on state persisted by SUT.

```
When: SUT stores data in database/file/external system
```

```
sut.saveUser(user)
savedUser = repository.findById(user.id)
assert savedUser.name == user.name
```

---

## Assertion Patterns

### Single Assertion Pattern
Each test contains one logical assertion.

**"Logical assertion"** may be multiple assert statements verifying one outcome:
```
// One logical assertion about the returned user
assert user.name == "Alice"
assert user.email == "alice@test.com"
assert user.role == ADMIN
```

**Multiple conditions** should be separate tests:
```
// Bad: testing two things
test_user_creation() {
    user = createUser()
    assert user.isValid()      // one condition
    assert audit.wasLogged()   // different condition
}

// Good: separate tests
test_created_user_is_valid()
test_user_creation_is_audited()
```

### Guard Assertion
Assertion that validates test setup before exercise.

```
When: Complex setup where errors could cause false passes
```

```
test() {
    user = createExpiredUser()
    assert user.isExpired()    // guard: verify setup is correct
    
    result = sut.attemptLogin(user)
    
    assert result.isDenied()
}
```

Use sparingly - if you need many guards, setup is too complex.

### Delta Assertion
Assert on change rather than final state.

```
When: Initial state varies or is complex
```

```
initialCount = repository.count()

sut.createUser(userData)

assert repository.count() == initialCount + 1
```

### Custom Assertion
Domain-specific assertion encapsulating verification logic.

```
Pros: Readable; reusable; better error messages
Cons: Additional code to maintain
When: Same complex verification appears in multiple tests
```

```
// Instead of:
assert user.name == expected.name
assert user.email == expected.email  
assert user.role == expected.role

// Create:
assertUsersEqual(actual, expected)

// With clear failure message:
// "Users differ: expected role ADMIN but was USER"
```

**Guidelines:**
- Name reveals what's being verified
- Provide detailed failure messages
- Keep verification logic simple

### Assertion Message
Descriptive text explaining assertion purpose.

```
assert balance >= 0, "Account balance should never be negative"
assert items.length == 3, "Order should contain exactly 3 items"
```

Essential for:
- Multiple assertions (Assertion Roulette prevention)
- Non-obvious expectations
- Complex conditions

---

## Expected Exception Patterns

### Expected Exception Test
Test verifies SUT throws expected exception.

Use framework mechanism rather than try/catch:

```
// Preferred: Framework annotation/method
@Test(expected = InvalidInputException.class)
void rejectsNullInput() {
    sut.process(null)
}

// Or: Framework assertion
assertThrows(InvalidInputException.class, () -> {
    sut.process(null)
})
```

### Exception Content Verification
Verify exception details, not just type.

```
exception = assertThrows(ValidationException.class, () -> {
    sut.process(invalidData)
})

assert exception.field == "email"
assert exception.message.contains("invalid format")
```

---

## Verification Anti-Patterns

### Assertion Roulette
Multiple unrelated assertions without messages.

```
// Bad: Which assertion failed?
test() {
    result = sut.process(input)
    assert result.isValid()
    assert result.code == 200
    assert result.data.length == 3
    assert result.timestamp != null
}
```

**Fix:** Add assertion messages or split into focused tests.

### Sensitive Equality
Assertion compares more than necessary.

```
// Bad: Fails if any field differs
assert actualUser == expectedUser

// Better: Check what matters for this test
assert actualUser.email == "test@example.com"
```

### Verification Logic in Production
Production code has methods only used for testing.

```
// Bad: Production code
class Order {
    // Only exists for tests to verify internal state
    List<LineItem> getLineItemsForTesting() { ... }
}
```

**Fix:** Test through public interface; verify observable behavior.

### Missing Assertion
Test exercises SUT but never verifies.

```
// Bad: No verification
test() {
    sut.process(input)
    // ... nothing checked
}
```

Sometimes acceptable for "smoke tests" verifying no exception, but make intent clear:
```
test_processing_does_not_throw() {
    // Implicit assertion: no exception
    sut.process(input)
}
```