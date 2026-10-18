---
name: clean-code
description: "Apply Clean Code principles from Robert C. Martin's book when writing or reviewing code. Use when: (1) Writing new code that should be readable and maintainable, (2) Reviewing or refactoring existing code, (3) Naming variables, functions, or classes, (4) Structuring functions and classes, (5) Writing tests. This skill encodes the key principles from 'Clean Code: A Handbook of Agile Software Craftsmanship'."
---

# Clean Code Principles

Apply Robert C. Martin's Clean Code principles to write readable, maintainable code.

## Core Philosophy

- Code is read far more often than it is written—optimize for readability
- The Boy Scout Rule: Leave the code cleaner than you found it
- Clean code does one thing well
- The best comment is the one you found a way not to write

---

## Naming

### Rules

- Use intention-revealing names that explain why it exists, what it does, how it's used
- Use pronounceable names (facilitates discussion)
- Use searchable names (avoid single-letter variables except loop counters)
- Replace magic numbers with named constants
- Avoid encodings, prefixes, and type information in names
- Make meaningful distinctions (avoid `a1`, `a2`, `theProduct` vs `product`)
- One word per concept (don't mix `fetch`, `retrieve`, `get` for same action)

### Examples

```
# Bad
int d; // elapsed time in days
def calc(a1, a2): ...

# Good
int elapsedTimeInDays;
def calculateTotal(basePrice, taxRate): ...
```

---

## Functions

### Rules

- **Small**: Functions should be small. Then smaller than that. Rarely over 20 lines.
- **Do one thing**: A function should do one thing, do it well, do it only.
- **One level of abstraction**: Don't mix high-level and low-level operations.
- **Descriptive names**: Function name should describe exactly what it does.
- **Few arguments**: Zero is ideal, one is good, two is acceptable, three requires justification.
- **No side effects**: Don't do hidden things (modify globals, change passed objects unexpectedly).
- **No flag arguments**: Split into separate functions instead of `render(true)`.
- **Command Query Separation**: Either do something OR answer something, not both.
- **Prefer exceptions to error codes**: Don't force caller to handle errors inline.
- **DRY**: Don't Repeat Yourself. Extract duplication.

### The Stepdown Rule

Code should read like a top-down narrative. Each function should be followed by those at the next level of abstraction.

```
def processPayment():
    validateOrder()
    chargeCustomer()
    sendConfirmation()

def validateOrder(): ...
def chargeCustomer(): ...
def sendConfirmation(): ...
```

---

## Comments

### When Comments Are Acceptable

- Legal comments (copyright, license)
- Explanation of intent (why, not what)
- Clarification of obscure external code you can't change
- Warning of consequences
- TODO comments (use sparingly)
- Documentation for public APIs

### When Comments Are Code Smells

- Redundant comments that repeat the code
- Misleading or outdated comments
- Commented-out code (delete it—version control remembers)
- Noise comments (`// default constructor`)
- Position markers (`// ============`)
- Closing brace comments (`} // end if`)

### The Real Rule

If you need a comment, first try to refactor the code to make it self-explanatory.

```
# Bad
// Check if employee is eligible for benefits
if ((employee.flags & HOURLY_FLAG) && (employee.age > 65))

# Good
if (employee.isEligibleForBenefits())
```

---

## Formatting

### Vertical Formatting

- **Newspaper metaphor**: Name at top, high-level summary, then details
- **Vertical openness**: Blank lines between concepts
- **Vertical density**: Related lines close together
- **Vertical distance**: Declare variables close to usage
- **Dependent functions**: Caller above callee
- **File size**: Prefer smaller files (200-500 lines)

### Horizontal Formatting

- Keep lines short (80-120 characters)
- Use whitespace to associate/disassociate
- Don't use horizontal alignment (it draws attention to wrong things)
- Consistent indentation

### Team Rules

Agree on formatting rules as a team and follow them consistently.

---

## Objects and Data Structures

### The Distinction

- **Objects**: Hide data, expose behavior through methods
- **Data structures**: Expose data, have no meaningful behavior

### Law of Demeter

A method should only call methods on:
- Its own object
- Objects passed as parameters
- Objects it creates
- Its direct component objects

```
# Bad (train wreck)
ctxt.getOptions().getScratchDir().getAbsolutePath()

# Good
ctxt.getScratchDirectoryPath()
```

### Avoid Hybrids

Don't create half-object, half-data-structure hybrids. Choose one paradigm.

---

## Error Handling

### Rules

- Use exceptions rather than return codes
- Write try-catch-finally first (defines scope and expectations)
- Provide context with exceptions (what failed and why)
- Define exception classes by caller's needs
- Don't return null (return empty collection, Optional, or throw)
- Don't pass null (validate inputs, use assertions)

### Special Case Pattern

Create objects that handle special cases so callers don't need conditional logic.

```
# Instead of null checks everywhere
if (employee is None):
    return MissingEmployee()  # Special case object with safe defaults
```

---

## Unit Tests

### Three Laws of TDD

1. Write a failing test before writing production code
2. Write only enough test to fail (not compiling counts as failing)
3. Write only enough production code to pass the current test

### F.I.R.S.T. Principles

- **Fast**: Tests should run quickly
- **Independent**: Tests should not depend on each other
- **Repeatable**: Tests should work in any environment
- **Self-validating**: Tests should have boolean output (pass/fail)
- **Timely**: Tests should be written just before production code

### Clean Tests

- One concept per test
- One assert per test (ideally)
- Tests should be as clean as production code
- Readable tests serve as documentation

---

## Classes

### Rules

- **Small**: Classes should be small, measured by responsibilities
- **Single Responsibility Principle (SRP)**: One reason to change
- **Cohesion**: Methods should use most instance variables
- **Open/Closed Principle**: Open for extension, closed for modification

### Organization

1. Public static constants
2. Private static variables
3. Private instance variables
4. Public functions
5. Private utilities called by public functions

### Encapsulation

Keep variables and utility functions private. Only loosen for tests if necessary.

---

## SOLID Principles

| Principle | Description |
|-----------|-------------|
| **S**ingle Responsibility | A class has one reason to change |
| **O**pen/Closed | Open for extension, closed for modification |
| **L**iskov Substitution | Subtypes must be substitutable for base types |
| **I**nterface Segregation | Clients shouldn't depend on unused interfaces |
| **D**ependency Inversion | Depend on abstractions, not concretions |

---

## Code Smells

### Bloaters
- Long method
- Large class
- Long parameter list
- Data clumps (groups of data that appear together)

### Object-Orientation Abusers
- Switch statements (often can use polymorphism)
- Refused bequest (subclass doesn't use inherited methods)
- Temporary field

### Change Preventers
- Divergent change (class changed for multiple reasons)
- Shotgun surgery (one change requires many class edits)
- Parallel inheritance hierarchies

### Dispensables
- Comments (often indicate unclear code)
- Duplicate code
- Dead code
- Speculative generality (YAGNI)

### Couplers
- Feature envy (method uses another class more than its own)
- Inappropriate intimacy (classes too involved with each other)
- Message chains (train wrecks)

---

## Application Checklist

When writing or reviewing code, verify:

- [ ] Names reveal intention and are pronounceable
- [ ] Functions are small and do one thing
- [ ] Functions have few arguments (≤3)
- [ ] No flag arguments
- [ ] Comments explain why, not what (or aren't needed)
- [ ] Formatting is consistent with team standards
- [ ] Error handling uses exceptions, not return codes
- [ ] No null returns or null parameters
- [ ] Tests exist and follow F.I.R.S.T.
- [ ] Classes have single responsibility
- [ ] No code duplication (DRY)
- [ ] Law of Demeter is respected