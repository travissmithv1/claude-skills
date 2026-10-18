---
name: advanced-refactoring
description: Refactor to, towards, or away from design patterns using Joshua Kerievsky's catalog from Refactoring to Patterns. Use when evolving designs toward patterns, simplifying over-engineered code, or when asked about pattern-directed refactoring.
---

# Advanced Refactoring Skill

Apply Joshua Kerievsky's pattern-directed refactorings to evolve designs safely using sequences of low-level refactorings.

## Core Philosophy

- Using patterns to improve existing code is better than using patterns early in a new design
- Patterns are where you want to be; refactorings are ways to get there
- Refactor TO patterns when they simplify, AWAY from patterns when simpler solutions exist
- Large changes happen through tiny steps

## Design Smells Indicating Pattern-Directed Refactoring

### Duplicated Code
Same structure in multiple places → Extract Method, Form Template Method, Chain Constructors

### Long Method
Method doing too much → Compose Method, Replace Conditional with Strategy

### Conditional Complexity
Complex conditional logic in calculations → Replace Conditional with Strategy, Replace Conditional with Polymorphism

### Primitive Obsession
Building structures with primitives → Replace Implicit Tree with Composite

### Large Class
Class with too many responsibilities → Extract Class, Replace Conditional with Strategy

### Switch Statements
Type-based switching → Replace Type Code with Class, Replace Conditional with Polymorphism

### Parallel Inheritance Hierarchies
Adding subclass requires sibling subclass → Replace Inheritance with Delegation

### Combinatorial Explosion
Many combinations of behavior → Decorator, Strategy

### Oddball Solution
Same problem solved differently in different places → Substitute Algorithm, Unify Interfaces

### Indecent Exposure
Exposing implementation details → Encapsulate Classes with Factory, Hide Delegate

### Solution Sprawl
Responsibilities spread across classes → Move Method, Inline Class

### Feature Envy
Method uses another class's data extensively → Move Method

## Catalog of Pattern-Directed Refactorings

### Creation Refactorings

#### Chain Constructors
**Problem:** Multiple constructors contain duplicate code
**Solution:** Chain constructors together so specific ones call more general ones
**Mechanics:**
1. Find two constructors with duplicate code
2. Determine if A can call B or B can call A
3. Make the call, removing duplicate code
4. Repeat until one catch-all constructor handles all cases
5. Change visibility of constructors that don't need to be public

#### Replace Constructors with Creation Methods
**Problem:** Many constructors make it hard to decide which to call
**Solution:** Replace constructors with intention-revealing static creation methods
**Mechanics:**
1. Identify class with copious constructors
2. Identify or create catch-all constructor, make it protected
3. For each object type, create intention-revealing Creation Method
4. Replace constructor calls with Creation Method calls

#### Encapsulate Classes with Creation Methods
**Problem:** Subclasses implement common interface but clients instantiate them directly
**Solution:** Hide subclasses behind superclass Creation Methods
**Mechanics:**
1. Make subclass constructor protected
2. Create Creation Method on superclass that returns subclass instance
3. Replace client calls to subclass constructor with superclass Creation Method

#### Extract Creation Class
**Problem:** Too many Creation Methods obscure class's primary responsibility
**Solution:** Move Creation Methods to dedicated Creation Class
**Mechanics:**
1. Identify class overbalanced with Creation Methods
2. Create new class named after its purpose (creating objects)
3. Move all Creation Methods to new class
4. Update callers

### Simplification Refactorings

#### Compose Method
**Problem:** Method logic is hard to understand
**Solution:** Transform method into well-named steps at same level of abstraction
**Mechanics:**
1. Extract methods from chunks of logic
2. Name each method to reveal intention
3. Ensure all steps are at same level of abstraction
4. Remove duplication and dead code

#### Replace Conditional Logic with Strategy
**Problem:** Conditional logic in calculation makes it hard to understand
**Solution:** Delegate calculation to Strategy objects
**Mechanics:**
1. Identify calculation method with conditional logic
2. Create concrete Strategy class
3. Move calculation method and helpers to Strategy
4. Pass context to Strategy for data access
5. Create Strategy field in context, delegate to it
6. Apply Replace Conditional with Polymorphism on Strategy
7. Create concrete Strategy subclasses for each variation

#### Replace State-Altering Conditionals with State
**Problem:** Conditional logic controls object's state transitions
**Solution:** Use State pattern to handle transitions
**Mechanics:**
1. Identify state-altering conditional code
2. Create State interface with method for each action
3. Create concrete State class for each state
4. Move state-specific behavior to State classes
5. Delegate actions to current State object

### Generalization Refactorings

#### Form Template Method
**Problem:** Similar methods in subclasses follow same sequence but differ in details
**Solution:** Extract common sequence to superclass, leave varying steps abstract
**Mechanics:**
1. Identify similar methods in subclasses
2. Extract differing code into separate methods
3. Pull up identical code to superclass
4. Create abstract methods for varying steps

#### Replace Implicit Tree with Composite
**Problem:** Building tree structure with primitives (like String concatenation for XML)
**Solution:** Replace primitive representation with Composite
**Mechanics:**
1. Identify primitive tree-construction code
2. Create node types for Composite
3. Give nodes ability to have children
4. Add attribute/value support if needed
5. Replace primitive construction with Composite calls

#### Replace One/Many Distinctions with Composite
**Problem:** Code handles single object differently from collection of objects
**Solution:** Use Composite to treat single and multiple uniformly
**Mechanics:**
1. Identify code that distinguishes one from many
2. Create Composite that can hold one or many
3. Make single object and Composite implement same interface
4. Replace conditional logic with polymorphic calls

### Protection Refactorings

#### Encapsulate Composite with Builder
**Problem:** Composite exposes too many details to clients
**Solution:** Hide Composite behind Builder with simpler interface
**Mechanics:**
1. Identify Composite to encapsulate
2. Create Builder with private Composite instance
3. Initialize Composite in constructor
4. Create method to return build results
5. Create intention-revealing methods for adding nodes
6. Replace Composite calls with Builder calls

#### Extract Special-Case Logic into Decorators
**Problem:** Classes have optional or special-case processing mixed with core logic
**Solution:** Extract optional logic into Decorator classes
**Mechanics:**
1. Find algorithm bulky with optional logic
2. Create interface from class's public methods
3. Create concrete Decorator implementing interface
4. Add delegate instance variable, forward all methods
5. Move special-case logic to Decorator
6. Repeat for other special cases
7. Create abstract Decorator for shared implementation

#### Replace Hard-Coded Notifications with Observer
**Problem:** Object notifies specific objects of changes
**Solution:** Use Observer to decouple notification from specific observers
**Mechanics:**
1. Identify hard-coded notification code
2. Create Observer interface with update method
3. Create Subject with observer list and notify method
4. Make notifying class a Subject
5. Make notified classes Observers
6. Replace hard-coded calls with notify()

### Accumulation Refactorings

#### Move Accumulation to Collecting Parameter
**Problem:** Accumulating information spread across many methods
**Solution:** Pass collecting object through methods to accumulate results
**Mechanics:**
1. Identify accumulation scattered across methods
2. Create or identify collecting object
3. Pass collecting object as parameter
4. Have each method add to collecting object
5. Return or use collected result

#### Move Accumulation to Visitor
**Problem:** Accumulation logic clutters element classes in hierarchy
**Solution:** Move accumulation to Visitor that traverses hierarchy
**Mechanics:**
1. Identify accumulation across class hierarchy
2. Create Visitor with visit method for each element type
3. Add accept method to each element
4. Move accumulation logic to Visitor
5. Traverse hierarchy with Visitor

## Pattern Implementation Guidance

### When to Refactor TO a Pattern
- Existing code is hard to extend
- Same structure appears in multiple places
- Conditional logic is growing
- New requirements don't fit current structure

### When to Refactor AWAY from a Pattern
- Pattern adds complexity without benefit
- Simpler solution discovered
- Pattern was applied speculatively
- Requirements changed

### Implementation Preferences
- Implement patterns in the simplest possible way
- Don't over-engineer - start simple
- Let tests drive pattern emergence
- Refactor incrementally, never break tests

## Process

1. **Identify smell** - What's wrong with current code?
2. **Choose target** - Which pattern (or simpler solution) addresses it?
3. **Plan steps** - Break into low-level refactorings
4. **Test first** - Ensure existing behavior is covered
5. **Small steps** - Apply one refactoring at a time
6. **Run tests** - After every change
7. **Evaluate** - Is the pattern helping? Adjust if needed

## Output Format

When applying pattern-directed refactoring:

1. **Smell identified** - Name the design smell
2. **Target pattern** - Pattern to refactor to (or away from)
3. **Refactoring sequence** - List of low-level refactorings to apply
4. **Before** - Show problematic code
5. **After** - Show refactored code
6. **Why** - How this improves the design

## Constraints

- Never break existing tests
- Apply one low-level refactoring at a time
- Run tests after each refactoring
- Don't introduce pattern unless it simplifies
- Prefer composition over inheritance
- Keep functions under 10 lines