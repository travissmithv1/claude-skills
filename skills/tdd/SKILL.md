---
name: tdd
description: Practice Test-Driven Development using Kent Beck's patterns from Test-Driven Development By Example. Use when writing tests, implementing features test-first, or when asked to use TDD.
---

# Test-Driven Development Skill

Apply Kent Beck's TDD methodology: write failing tests first, make them pass with minimal code, then refactor.

## The TDD Mantra

**Red → Green → Refactor**

1. **Red** - Write a small test that fails (or doesn't compile)
2. **Green** - Make the test pass as quickly as possible, committing whatever sins necessary
3. **Refactor** - Eliminate all duplication created while getting the test to pass

## Two Fundamental Rules

1. Write new code only if an automated test has failed
2. Eliminate duplication

## Core Principles

- Tests are the ratchet - once green, always green
- Small steps reduce risk of errors
- Clean code that works - now
- Fear management through rapid feedback
- The gap between decision and feedback should be controlled deliberately

## TDD Patterns (Chapter 25)

### Test First
Write the test before the code. Period.

### Test List
Before coding, write a list of all tests you need to pass. Add to it as you think of new tests. Cross off tests as they pass.

### Assert First
Write the assertion first, then work backward to the setup.

### Test Data
Use data that makes tests easy to read. Prefer realistic data only when it matters. Use obvious, simple values (1, 2, 3) unless testing specific edge cases.

### Evident Data
Include expected and actual values in the test itself. The reader should see the relationship between inputs and outputs without calculation.

### Isolated Tests
Tests should not depend on each other. Each test runs independently with its own setup and teardown.

## Red Bar Patterns (Chapter 26)

### One Step Test
Pick a test from the list that will teach you something and that you're confident you can implement.

### Starter Test
Start with a variant of an operation that doesn't do anything. Get the test infrastructure working first.

### Explanation Test
Ask for and give explanations in terms of tests. Spread TDD by framing discussions around test cases.

### Learning Test
Write tests for external APIs before using them. Verify assumptions about third-party code.

### Another Test
When a tangent idea arises, add it to the test list and stay focused on the current test.

### Regression Test
When a defect is reported, write a test that fails. Then fix it. The test documents the bug forever.

### Break
When stuck, take a break. Walk away. The answer often comes when you stop forcing it.

### Do Over
When lost, throw away the code and start fresh. Sometimes it's faster than debugging.

## Testing Patterns (Chapter 27)

### Child Test
When a test is too big, write a smaller test representing the broken part. Get the child test working, then return to the larger test.

### Mock Object
Create a fake version of an expensive or complicated resource. Use mocks for databases, network calls, file systems.

### Self Shunt
Have the test class itself serve as the mock object by implementing the required interface.

### Log String
Record method calls in a string for testing sequence and composition of operations.

### Crash Test Dummy
Create a special object that throws exceptions to test error handling paths.

### Broken Test
Leave a test broken when ending a session. It tells you exactly where to start next time.

### Clean Check-in
Never check in with broken tests. The test suite must always be green.

## Green Bar Patterns (Chapter 28)

### Fake It ('Til You Make It)
Return a constant to pass the test. Gradually replace constants with variables until real code emerges. Psychological green bar matters.

### Triangulate
Abstract only when you have two or more examples. Add another test that demands generalization, then generalize.

### Obvious Implementation
When you know what to type, just type it. If it works, move on. If it fails, back up to Fake It.

### One to Many
Implement an operation for a single element first. Then make it work for collections.

## xUnit Patterns (Chapter 29)

### Assertion
Use explicit boolean checks. Make tests self-checking. assertEquals(expected, actual) not just assertTrue(something).

### Fixture
Shared setup code for multiple tests. Use setUp() for common object creation.

### External Fixture
When setup/teardown involves external resources (files, databases), ensure proper cleanup in tearDown().

### Test Method
One test method tests one scenario. Name describes what is being tested. Use arrange/act/assert structure.

### Exception Test
Test that exceptions are thrown when expected. Don't just test the happy path.

### All Tests
Create a suite that runs every test. One command should run all tests.

## Design Patterns for TDD (Chapter 30)

### Command
Encapsulate an operation as an object. Useful for implementing undo, logging, and test doubles.

### Value Object
Objects whose equality is based on value, not identity. Immutable. $5 equals $5 regardless of which instance.

### Null Object
Return an object that does nothing instead of null. Eliminates null checks.

### Template Method
Define algorithm skeleton in superclass. Let subclasses override specific steps.

### Pluggable Object
Use objects to represent variation instead of conditionals.

### Pluggable Selector
Store method name as instance variable. Call dynamically. Reduces conditional logic.

### Factory Method
Create objects through methods instead of constructors. Allows subclasses to decide which class to instantiate.

### Imposter
Introduce a new implementation of an existing protocol. Tests and production code treat it identically.

### Composite
Treat collections and single elements uniformly. A TestSuite is a Composite of TestCases.

### Collecting Parameter
Pass a parameter to collect results across multiple method calls.

## Refactoring in TDD (Chapter 31)

### Reconcile Differences
Make code look similar, then unify it.

### Isolate Change
First isolate the code to change, then change it.

### Migrate Data
Move data from one representation to another temporarily keeping both, then remove the old.

### Extract Method
Turn a code fragment into a method whose name explains the purpose.

### Inline Method
Replace a method call with the method's body when the body is as clear as the name.

### Extract Interface
Pull out a subset of methods into an interface.

### Move Method
Move a method to the class that uses it most.

### Method Object
Turn a complex method into its own object where local variables become fields.

### Add Parameter
Add a parameter when a method needs more information.

### Method Parameter to Constructor Parameter
Move a parameter from method to constructor when it's used by multiple methods.

## Myers' Essential TDD — Additional Emphases

Beck's patterns above are the mechanics. Rob Myers' *Essential Test-Driven Development* adds emphases worth keeping front of mind (the rest of his canon — the red/green/refactor cycle, FIRST, test doubles — is already covered here and in the clean-code, xunit-test-patterns, and legacy-code skills):

- **TDD is a design discipline, not a testing technique.** The tests are a means to drive *good design*; passing tests are a byproduct. If you treat TDD as "writing tests first," you miss the point.
- **Good design (SOLID) emerges from the cycle.** Don't design the whole class up front. Small failing tests pressure you toward single-responsibility, dependency injection, and small interfaces. Let the design emerge from making tests easy to write; pain writing a test is a design smell.
- **The refactor step is not optional — it's where the design is paid for.** The most common failure is skipping refactor and accumulating green-but-ugly code. Every cycle ends with: is there duplication or a clearer structure to extract *now*, while tests are green?
- **Test behavior, not implementation.** Name and write tests around observable behavior and intent, not methods or internal structure — so tests survive refactoring instead of breaking on every internal change. A test that knows *how* the code works (not just *what* it does) is brittle.
- **Programmer tests vs. customer/acceptance tests.** TDD's microcycle produces fast *programmer tests* that drive units of design. These are distinct from *acceptance tests* that express what the customer wants; both matter, at different levels (see the automated-testing skill's pyramid).
- **The economic case ("why"):** TDD trades a little up-front discipline for far less debugging and a lower cost of change later — the value is sustained pace, not test coverage as a metric.

## Process

For each feature:

1. Add test to test list
2. Pick simplest test from list (One Step Test)
3. Write the test (Assert First, Test Data)
4. Watch it fail (Red)
5. Make it pass with simplest code (Fake It or Obvious Implementation)
6. Watch it pass (Green)
7. Refactor to remove duplication
8. Cross test off list
9. Repeat

## Step Size Guidelines

- When confident: take bigger steps (Obvious Implementation)
- When uncertain: take tiny steps (Fake It, Triangulate)
- When failing: take even smaller steps
- If a test takes more than 10 minutes to pass, throw it away and write a smaller one

## Output Format

When implementing with TDD, show:

1. **Test List** - What tests need to pass
2. **Current Test** - The test being written
3. **Red** - Show failing test (or that it fails)
4. **Green** - Show minimal code to pass
5. **Refactor** - Show cleanup if needed
6. **Updated List** - Cross off completed, add new discoveries

## Constraints

- Never write production code without a failing test
- One assertion per test
- Tests must run in isolation
- Tests must be deterministic
- All tests must pass before any commit
- Each test should have exactly one reason to fail
- Never have more than one test failing at a time
- Focus on one test at a time: make it fail for the right reasons, get it passing, refactor, then move on

## When NOT to Use TDD

- Infrastructure changes (Terraform, CloudFormation, etc.)
- Configuration changes (environment variables, build configs, etc.)
- These are validated through deployment and manual verification, not automated tests