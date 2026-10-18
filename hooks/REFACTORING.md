# Refactoring Guide

Based on Martin Fowler, *Refactoring: Improving the Design of Existing Code*, 2nd Edition (2018).

This file is the long-form reference pointed to by `~/.claude/hooks/tdd-check.sh`. After a test goes green, stop and scan the code you just touched for the smells below. If any are present, apply the matching refactoring(s) in small steps, running tests after each step, before writing the next test.

---

## The Two Hats

Fowler's central discipline. At any moment, you are wearing exactly one of these:

- **Adding behavior (Red → Green).** Write a failing test. Make it pass. Do not improve structure.
- **Refactoring.** Tests stay green throughout. Improve structure only. Do not add behavior.

Never wear both at once. If you notice a missing behavior while refactoring, note it and write a failing test for it next — do not add it in the refactor step.

---

## The Mechanics

Refactoring is safe only if you apply it as a discipline, not a burst of cleanup.

1. Take the smallest step you can name.
2. Run the tests after each step.
3. If tests go red, revert and take a smaller step.
4. Commit after each named refactoring completes green.

If you can't take a step without the tests going red, the step was too big. Shrink it.

---

## Code Smells → Refactorings

The 22 smells from ch. 3 of the 2nd edition, grouped by Fowler's categories, with the refactoring(s) he recommends.

### Bloaters

| Smell | Refactoring |
|-------|-------------|
| Long Function | Extract Function; Replace Temp with Query; Introduce Parameter Object; Preserve Whole Object; Decompose Conditional; Replace Conditional with Polymorphism; Split Loop |
| Long Parameter List | Replace Parameter with Query; Preserve Whole Object; Introduce Parameter Object; Remove Flag Argument; Combine Functions into Class |
| Large Class | Extract Class; Extract Superclass; Replace Type Code with Subclasses |
| Primitive Obsession | Replace Primitive with Object; Replace Type Code with Subclasses; Replace Conditional with Polymorphism; Extract Class; Introduce Parameter Object |
| Data Clumps | Extract Class; Introduce Parameter Object; Preserve Whole Object |

### Object-Orientation Abusers

| Smell | Refactoring |
|-------|-------------|
| Repeated Switches | Replace Conditional with Polymorphism |
| Loops | Replace Loop with Pipeline |
| Refused Bequest | Push Down Method; Push Down Field; Replace Subclass with Delegate; Replace Superclass with Delegate |
| Alternative Classes with Different Interfaces | Change Function Declaration; Move Function; Extract Superclass |

### Change Preventers

| Smell | Refactoring |
|-------|-------------|
| Divergent Change | Split Phase; Move Function; Extract Function; Extract Class |
| Shotgun Surgery | Move Function; Move Field; Combine Functions into Class; Combine Functions into Transform; Split Phase; Inline Function; Inline Class |

### Dispensables

| Smell | Refactoring |
|-------|-------------|
| Duplicated Code | Extract Function; Slide Statements; Pull Up Method |
| Lazy Element | Inline Function; Inline Class; Collapse Hierarchy |
| Speculative Generality | Collapse Hierarchy; Inline Function; Inline Class; Change Function Declaration; Remove Dead Code |
| Dead Code | Remove Dead Code |
| Comments (masking bad code) | Extract Function; Change Function Declaration; Introduce Assertion |

### Couplers

| Smell | Refactoring |
|-------|-------------|
| Feature Envy | Move Function; Extract Function |
| Insider Trading (Inappropriate Intimacy) | Move Function; Move Field; Hide Delegate; Replace Subclass with Delegate; Replace Superclass with Delegate |
| Message Chains | Hide Delegate; Extract Function; Move Function |
| Middle Man | Remove Middle Man; Inline Function; Replace Superclass with Delegate; Replace Subclass with Delegate |

### Other

| Smell | Refactoring |
|-------|-------------|
| Mysterious Name | Change Function Declaration (rename); Rename Variable; Rename Field |
| Mutable Data | Encapsulate Variable; Split Variable; Extract Function; Separate Query from Modifier; Remove Setting Method; Replace Derived Variable with Query; Change Reference to Value |
| Global Data | Encapsulate Variable |
| Temporary Field | Extract Class; Move Function; Introduce Special Case |
| Data Class | Encapsulate Record; Remove Setting Method; Move Function; Extract Function; Split Phase |

---

## Refactoring Catalog (reference)

From Fowler 2nd ed. catalog chapters 6–12. The named refactorings grouped by purpose.

**Basic.** Extract Function, Inline Function, Extract Variable, Inline Variable, Change Function Declaration, Encapsulate Variable, Rename Variable, Introduce Parameter Object, Combine Functions into Class, Combine Functions into Transform, Split Phase.

**Moving Features.** Move Function, Move Field, Move Statements into Function, Move Statements to Callers, Replace Inline Code with Function Call, Slide Statements, Split Loop, Replace Loop with Pipeline, Remove Dead Code.

**Organizing Data.** Split Variable, Rename Field, Replace Derived Variable with Query, Change Reference to Value, Change Value to Reference.

**Simplifying Conditional Logic.** Decompose Conditional, Consolidate Conditional Expression, Replace Nested Conditional with Guard Clauses, Replace Conditional with Polymorphism, Introduce Special Case (Null Object), Introduce Assertion.

**Refactoring APIs.** Separate Query from Modifier, Parameterize Function, Remove Flag Argument, Preserve Whole Object, Replace Parameter with Query, Replace Query with Parameter, Remove Setting Method, Replace Constructor with Factory Function, Replace Function with Command, Replace Command with Function.

**Dealing with Inheritance.** Pull Up Method, Pull Up Field, Pull Up Constructor Body, Push Down Method, Push Down Field, Replace Type Code with Subclasses, Remove Subclass, Extract Superclass, Collapse Hierarchy, Replace Subclass with Delegate, Replace Superclass with Delegate.

**Encapsulation.** Encapsulate Record, Encapsulate Collection, Replace Primitive with Object, Replace Temp with Query, Extract Class, Inline Class, Hide Delegate, Remove Middle Man, Substitute Algorithm.

---

## Applying This to Generated Code

For *every* edit to production TS/JS, after tests are green:

1. Re-read the edited function top to bottom.
2. Walk the smell list. For each smell present, name it out loud (in a comment or commit message).
3. Apply the smallest refactoring that addresses it. Run tests.
4. Repeat until no smell remains or the next step would require adding behavior — at which point, stop and write the next failing test.

If there is *no* smell, say so explicitly. "No smells; proceeding to next test." is a valid and useful step — it signals the refactor phase happened and was considered, rather than skipped.
