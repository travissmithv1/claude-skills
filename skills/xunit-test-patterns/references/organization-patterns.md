# Test Organization Patterns

## Table of Contents
- [Test Structure](#test-structure)
- [Test Naming](#test-naming)
- [Test File Organization](#test-file-organization)
- [Test Utility Patterns](#test-utility-patterns)

---

## Test Structure

### Four-Phase Test
Standard structure for all tests.

```
test() {
    // 1. Setup: Create fixture, put SUT in known state
    user = createUser()
    sut = new OrderService(repository)
    
    // 2. Exercise: Invoke the behavior being tested
    result = sut.createOrder(user, items)
    
    // 3. Verify: Check expected outcome
    assert result.isSuccess()
    assert result.order.total == 100
    
    // 4. Teardown: Clean up (often implicit)
}
```

**Guidelines:**
- Keep phases visually distinct (blank lines or comments)
- Setup should create minimal fixture
- Exercise should be a single action
- Verify should check one logical outcome
- Teardown is often unnecessary (garbage collection)

### Arrange-Act-Assert (AAA)
Synonym for Four-Phase Test (Setup-Exercise-Verify minus explicit Teardown).

### Given-When-Then
BDD-style structure. Same concept, different vocabulary.

```
// Given: Setup
given a registered user
and an item in stock

// When: Exercise  
when the user places an order

// Then: Verify
then the order is confirmed
and inventory is decremented
```

---

## Test Naming

### Descriptive Test Names
Name should describe scenario and expected outcome.

**Patterns:**
```
methodName_scenario_expectedResult
should_expectedBehavior_when_condition
test_featureOrBehavior_underCondition
```

**Examples:**
```
// Good: Describes what's being tested
calculateTotal_withDiscountCode_appliesDiscount
should_reject_login_when_account_is_locked
test_expired_subscription_prevents_access

// Bad: Doesn't describe scenario
testCalculate
test1
shouldWork
```

### Test as Documentation
Test names form executable specification.

```
// Reading these describes the system's behavior:
user_registration_sends_confirmation_email
user_registration_fails_with_invalid_email
user_registration_fails_with_duplicate_email
password_reset_expires_after_24_hours
password_reset_invalidates_previous_tokens
```

---

## Test File Organization

### Testcase Class per Class
One test file per production class.

```
src/
  User.java
  Order.java
test/
  UserTest.java
  OrderTest.java
```

Simple but can lead to large test files.

### Testcase Class per Feature
Test file per feature/behavior, may span multiple classes.

```
test/
  UserRegistrationTest.java    // tests User, EmailService, etc.
  UserAuthenticationTest.java  // tests User, Session, etc.
  OrderPlacementTest.java      // tests Order, Inventory, etc.
```

Better cohesion around behaviors.

### Testcase Class per Fixture
Test file per common fixture/setup.

```
test/
  EmptyCartTest.java           // tests starting with empty cart
  CartWithItemsTest.java       // tests starting with populated cart
  CartWithExpiredItemsTest.java
```

Groups tests that share setup.

### Test Hierarchy
Nested test classes for related scenarios.

```
class OrderTest {
    class WhenCartIsEmpty {
        test_cannot_place_order()
        test_displays_empty_message()
    }
    
    class WhenCartHasItems {
        test_calculates_total()
        test_applies_discount()
        
        class WithExpiredPromoCode {
            test_rejects_promo()
            test_shows_expiration_message()
        }
    }
}
```

---

## Test Utility Patterns

### Test Utility Method
Reusable helper methods for common test operations.

**Categories:**

**Creation Methods**: Build test objects
```
createUser()
createUserWithExpiredSubscription()
createOrderWithItems(count)
```

**Custom Assertions**: Domain-specific verification
```
assertUserIsValid(user)
assertOrderContainsItem(order, item)
assertResponseIsError(response, expectedCode)
```

**Finder Methods**: Locate test artifacts
```
findUserByEmail(email)
getLastNotification()
```

### Test Helper Class
Shared class containing Test Utility Methods.

```
class TestHelper {
    static User createUser() { ... }
    static Order createOrder(user) { ... }
    static void assertValid(user) { ... }
}
```

**Placement:**
- Same test package as tests using it
- Shared test utilities module for cross-project helpers

### Parameterized Test
Single test method, multiple data inputs.

```
@ParameterizedTest
@ValueSource(strings = {"", " ", "   "})
void rejects_blank_email(String email) {
    exception = assertThrows(ValidationException.class, () -> {
        new User(email)
    })
    assert exception.field == "email"
}
```

**When to use:**
- Same behavior with different inputs
- Boundary testing
- Validation rules

**When to avoid:**
- Different behaviors that happen to look similar
- When individual test names would be more descriptive

---

## Test Suite Organization

### Test Categories
Tag tests for selective execution.

```
@Category(SlowTests.class)
test_full_integration_workflow()

@Category(DatabaseTests.class)  
test_persistence_roundtrip()
```

Common categories:
- Unit / Integration / End-to-End
- Fast / Slow
- Smoke / Full

### Test Execution Order
Tests should be order-independent.

If order matters, you have **Interacting Tests** smell.

Some frameworks support explicit ordering for integration tests:
```
@Order(1) test_create_user()
@Order(2) test_user_can_login()
@Order(3) test_delete_user()
```

Use sparingly - prefer independent tests.

---

## Anti-Patterns

### Test Method Proliferation
Too many small tests in one class.

**Symptoms:**
- Hundreds of tests per class
- Hard to find relevant tests
- Duplicated setup across tests

**Fix:** Reorganize by feature or fixture.

### Complex Test Hierarchy
Deeply nested test classes.

**Symptoms:**
- 4+ levels of nesting
- Inherited setup is unclear
- Hard to understand what's being tested

**Fix:** Flatten hierarchy; use explicit setup methods.

### Chatty Test Helpers
Helpers that do too much or have unclear contracts.

**Fix:** 
- Single responsibility for each helper
- Clear naming that reveals intent
- Minimal parameters (use defaults)