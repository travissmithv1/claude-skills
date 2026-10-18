---
name: refactoring
description: Refactor code using Martin Fowler's catalog from Refactoring (2nd Edition). Use when asked to refactor, improve code structure, address code smells, or clean up code without changing behavior.
---

# Refactoring Skill

Apply Martin Fowler's refactoring techniques to improve code structure without changing external behavior.

## Core Principles

1. **Refactoring preserves behavior** - Tests must pass before and after each change
2. **Small steps** - Each transformation should be tiny and safe
3. **Run tests after every change** - Never skip verification
4. **Commit frequently** - Each successful refactoring is a commit point

## When to Refactor

- Before adding a feature (make the change easy, then make the easy change)
- When you encounter code smells
- During code review
- When code is hard to understand

## Code Smells (from Chapter 3)

Detect these problems and suggest appropriate refactorings:

### Bloaters
- **Long Function** - Functions exceeding 10 lines → Extract Function
- **Long Parameter List** - More than 3 parameters → Introduce Parameter Object, Preserve Whole Object
- **Large Class** - Class doing too much → Extract Class
- **Primitive Obsession** - Using primitives instead of small objects → Replace Primitive with Object
- **Data Clumps** - Groups of data appearing together → Extract Class, Introduce Parameter Object

### Change Preventers
- **Divergent Change** - One class changed for multiple reasons → Extract Class
- **Shotgun Surgery** - One change requires many small edits → Move Function, Move Field
- **Parallel Inheritance Hierarchies** - Creating subclass requires sibling → Move Function, Move Field

### Dispensables
- **Duplicated Code** - Same structure in multiple places → Extract Function, Slide Statements
- **Lazy Element** - Class/function not doing enough → Inline Function, Inline Class
- **Speculative Generality** - Unused abstractions → Collapse Hierarchy, Inline Function
- **Dead Code** - Unreachable code → Remove Dead Code
- **Comments** - Code needing explanation → Extract Function, Rename Variable

### Couplers
- **Feature Envy** - Function uses another object's data extensively → Move Function
- **Message Chains** - Long chains of getters → Hide Delegate, Extract Function
- **Middle Man** - Class delegating most work → Remove Middle Man
- **Inappropriate Intimacy** - Classes too intertwined → Move Function, Extract Class

### Object-Orientation Abusers
- **Repeated Switches** - Same switch in multiple places → Replace Conditional with Polymorphism
- **Temporary Field** - Fields only set in certain circumstances → Extract Class, Introduce Special Case
- **Refused Bequest** - Subclass ignores inherited behavior → Replace Subclass with Delegate

### Other
- **Mysterious Name** - Unclear naming → Rename Variable, Rename Function
- **Global Data** - Widely accessible mutable data → Encapsulate Variable
- **Mutable Data** - Data changed in place → Encapsulate Variable, Split Variable
- **Loops** - Imperative iteration → Replace Loop with Pipeline

## Refactoring Catalog (Chapters 6-12)

### Basic Refactorings (Chapter 6)
- **Extract Function** - Pull code into a named function
- **Inline Function** - Replace function call with body
- **Extract Variable** - Name a complex expression
- **Inline Variable** - Replace variable with expression
- **Change Function Declaration** - Rename or change parameters
- **Encapsulate Variable** - Wrap data access in functions
- **Rename Variable** - Improve variable name
- **Introduce Parameter Object** - Group related parameters
- **Combine Functions into Class** - Group functions operating on same data
- **Combine Functions into Transform** - Create a transform function for data enrichment
- **Split Phase** - Separate code operating in different phases

### Encapsulation (Chapter 7)
- **Encapsulate Record** - Replace record with class
- **Encapsulate Collection** - Return copy, provide add/remove methods
- **Replace Primitive with Object** - Wrap primitive in class
- **Replace Temp with Query** - Extract expression to function
- **Extract Class** - Split class with multiple responsibilities
- **Inline Class** - Merge class doing too little
- **Hide Delegate** - Create delegating method
- **Remove Middle Man** - Expose delegate directly
- **Substitute Algorithm** - Replace algorithm with clearer one

### Moving Features (Chapter 8)
- **Move Function** - Move function to appropriate module
- **Move Field** - Move field to appropriate class
- **Move Statements into Function** - Combine related statements
- **Move Statements to Callers** - Push behavior to callers
- **Replace Inline Code with Function Call** - Use existing function
- **Slide Statements** - Group related code together
- **Split Loop** - Separate loop doing multiple things
- **Replace Loop with Pipeline** - Use filter/map operations
- **Remove Dead Code** - Delete unreachable code

### Organizing Data (Chapter 9)
- **Split Variable** - Separate variable used for multiple purposes
- **Rename Field** - Improve field name
- **Replace Derived Variable with Query** - Compute instead of store
- **Change Reference to Value** - Make object immutable
- **Change Value to Reference** - Share object across system

### Simplifying Conditional Logic (Chapter 10)
- **Decompose Conditional** - Extract condition and branches
- **Consolidate Conditional Expression** - Combine conditions with same result
- **Replace Nested Conditional with Guard Clauses** - Exit early for special cases
- **Replace Conditional with Polymorphism** - Use objects instead of switches
- **Introduce Special Case** - Create class for special case behavior
- **Introduce Assertion** - Make assumptions explicit

### Refactoring APIs (Chapter 11)
- **Separate Query from Modifier** - Functions either return or modify, not both
- **Parameterize Function** - Add parameter to generalize
- **Remove Flag Argument** - Create separate functions for each flag value
- **Preserve Whole Object** - Pass object instead of extracted values
- **Replace Parameter with Query** - Derive parameter inside function
- **Replace Query with Parameter** - Pass value in for easier testing
- **Remove Setting Method** - Make field immutable
- **Replace Constructor with Factory Function** - Use factory for flexibility
- **Replace Function with Command** - Create command object
- **Replace Command with Function** - Simplify command to function
- **Return Modified Value** - Return instead of mutate

### Dealing with Inheritance (Chapter 12)
- **Pull Up Method** - Move method to superclass
- **Pull Up Field** - Move field to superclass
- **Pull Up Constructor Body** - Move constructor logic up
- **Push Down Method** - Move method to subclass
- **Push Down Field** - Move field to subclass
- **Replace Type Code with Subclasses** - Create subclass per type
- **Remove Subclass** - Replace subclass with field
- **Extract Superclass** - Create superclass for common behavior
- **Collapse Hierarchy** - Merge superclass and subclass
- **Replace Subclass with Delegate** - Use composition over inheritance
- **Replace Superclass with Delegate** - Use composition when inheritance misleads

## Refactoring Process

For each refactoring:

1. **Ensure tests exist** - Write tests first if missing
2. **Run tests** - Verify green before starting
3. **Make one small change** - Apply single transformation
4. **Run tests** - Verify still green
5. **Commit** - Lock in the progress
6. **Repeat** - Continue until smell is eliminated

## Output Format

When refactoring, provide:

1. **Smell identified** - Name the code smell detected
2. **Refactoring applied** - Name the refactoring from the catalog
3. **Before snippet** - Show the problematic code
4. **After snippet** - Show the refactored code
5. **Why** - Brief explanation of improvement

## Constraints

- Never change external behavior
- Each refactoring must be a single, named technique
- Functions must remain under 10 lines after refactoring
- Prefer many small refactorings over one large change
- Stop if tests fail and investigate