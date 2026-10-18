---
name: legacy-code
description: Work with legacy code using Michael Feathers' techniques from Working Effectively with Legacy Code. Use when dealing with untested code, breaking dependencies, adding tests to existing code, or safely modifying code without tests.
---

# Legacy Code Skill

Based on Michael Feathers' "Working Effectively with Legacy Code"

## Core Definition

Legacy code is code without tests.

## The Legacy Code Dilemma

Need tests to change code safely. Need to change code to add tests. Resolve with small, conservative refactorings before tests exist.

## Legacy Code Change Algorithm

1. Identify change points
2. Find test points
3. Break dependencies
4. Write characterization tests
5. Make changes and refactor

## Characterization Tests

Document actual behavior, not expected behavior.

1. Write test with dummy expected value
2. Run test, observe actual output
3. Update expected to match actual
4. Test now documents existing behavior

## Seams

A place to alter behavior without editing that place.

- Object seams: Dependency injection, subclass-and-override
- Link seams: Alter classpath or link to test versions
- Preprocessing seams: Preprocessor directives

## Breaking Dependencies

Goals:
- Sensing: Access values we cannot observe
- Separation: Make code independent enough for test harness

### Parameterize Constructor

Pass dependencies into constructor instead of creating internally.

### Extract Interface

Create interface for needed methods. Implement with fake for testing.

### Subclass and Override Method

Create testing subclass that overrides problematic methods.

### Parameterize Method

Pass dependency as parameter instead of creating inside method.

### Extract and Override Call

Extract problematic call to own method, override in testing subclass.

### Introduce Instance Delegator

Create instance methods delegating to static methods for seams.

### Replace Global Reference with Getter

Wrap global access in getter method that can be overridden.

## Adding Code Safely

### Sprout Method

Write new functionality in fresh method with TDD. Call from existing code.

1. Identify where change is needed
2. Write new code as separate method
3. Determine parameters from calling context
4. Call new method from original location

### Sprout Class

Create new class for changes when original class is untestable.

1. Identify the change
2. Create new class with TDD
3. Instantiate and use from original class

### Wrap Method

When new code runs before or after existing code.

1. Rename existing method
2. Create new method with original name
3. New method calls renamed method plus new functionality

### Wrap Class

Decorator pattern. New class wraps original, delegates most calls, adds behavior.

## Scratch Refactoring

Experimental refactoring to understand code. Make any changes to learn. Revert everything when done. Use understanding to plan proper changes.

## Effect Sketches

Draw diagrams of object calls and changes. Trace scenarios through connections. Find all clients including inheritance hierarchy.

## Unit Test Requirements

Not a unit test if it:
- Talks to database
- Communicates across network
- Touches file system
- Requires environment changes

Unit tests run under 1/10 second.

## Top Dependency-Breaking Techniques

From Feathers' 2021 reflection:

1. Parameterize Constructor
2. Extract Interface
3. Subclass and Override Method
4. Introduce Instance Delegator
5. Extract and Override Call

## Full Dependency-Breaking Toolbox

The book's 25-technique catalog (Chapter 25). Reach for these when the ones above aren't enough. Pick the smallest move that creates a seam.

- **Adapt Parameter** — when a method takes an argument you can't construct or fake in a test (e.g. `HttpServletRequest`), wrap it behind a small interface you own and pass that instead.
- **Break Out Method Object** — a long method using many locals/params won't move; turn it into its own class whose fields are those locals, then test the object in isolation.
- **Definition Completion** — in languages that allow it, declare a type/method and supply a test-only definition.
- **Encapsulate Global References** — wrap a global in a class so you can subclass-and-override or inject it.
- **Expose Static Method** — if a method doesn't use instance state, make it static so you can test it without constructing the (hard-to-build) object.
- **Extract and Override Factory Method** — move a constructor call out of a constructor into an overridable factory method.
- **Extract and Override Getter** — replace a field built in the constructor with a lazily-initialized getter you can override to return a fake.
- **Introduce Static Setter** — for singletons, add a setter so tests can replace the instance.
- **Link Seam / Replace Function with Function Pointer** — substitute at link time or via a pointer rather than editing call sites.
- **Parameterize Method** (have) / **Primitivize Parameter** — pass a free function plus primitive data when you can't yet build the full object.
- **Pull Up Feature** — pull the methods you want to test into an abstract superclass, test via a concrete testing subclass, leaving troublesome dependencies below.
- **Push Down Dependency** — push problematic dependencies into a new subclass; test the now-abstract parent via a testing subclass.
- **Replace Function with Function Pointer**, **Subclass and Override Method** (have), **Supersede Instance Variable** — swap a collaborator after construction.
- **Template Redefinition / Text Redefinition** — language-specific seams (C++ templates, interpreted languages).

## "I Can't Get This Class into a Test Harness"

Feathers' four recurring obstacles and the move for each:

1. Objects of the class can't be created easily → Adapt Parameter, Extract Interface, build a Fake collaborator.
2. The test harness won't easily build with the class in it → break the irritating dependency at a seam (Link/Object seam), Extract Interface.
3. The constructor we need to use has bad side effects → Extract and Override Factory Method, Supersede Instance Variable, Parameterize Constructor.
4. Significant work happens in the constructor that we need to sense → Extract and Override Getter, Supersede Instance Variable.

## Symptom → Technique (the "question" chapters)

The book's Part II is a set of question-titled chapters. Map the situation to the chapter's answer:

- "It takes forever to make a change" → understand the cause: lag time, breaking dependencies, building independently; find the **Pinch Point**.
- "How do I add a feature?" → Sprout/Wrap Method or Class; otherwise TDD behind a seam; Programming by Difference.
- "I can't run this method in a test harness" → expose/extract the method, break the constructor or hidden-method dependency.
- "My application is all API calls" → Skin and Wrap the API, or Responsibility-Based Extraction; lean on the lib boundary as a seam.
- "I don't understand the code well enough to change it" → Notes/Sketching, Listing Markup, Scratch Refactoring, delete unused code.
- "My code isn't object-oriented; how do I make changes?" → Introduce a sensing seam (link seam, `#define`, function pointer), then extract.
- "This class is too big and I don't want it to get bigger" → identify responsibilities (SRP heuristics, hidden methods/classes), Sprout Class, extract by feature.
- "I'm changing the same code all over the place" → that's Shotgun Surgery / lack of a single point; pull duplicated logic toward one place via Programming by Difference, then collapse.
- "I need to change a monster method" → Sprout, Introduce Sensing Variable, Extract What You Can Know, Gleaning Knowledge from Method Structure; **Lean on the Compiler** to find effects.
- "How do I know I'm not breaking anything?" → hyperaware editing, single-goal editing, Preserve Signatures, **Lean on the Compiler**, pair programming.

## Programming by Difference

Use inheritance to add a feature without editing tested code: subclass, override to introduce the variation, get it green, then refactor the inheritance away toward delegation/composition once tests cover it (avoid Liskov violations long-term).

## Lean on the Compiler

Make a declaration change (rename, change a type/signature) and let compile errors enumerate every affected site. A safe way to find dependencies and drive edits mechanically — works only in statically-typed languages.

## Pinch Points and Interception Points

- **Interception Point** — a place where you can write a test to sense an effect of a change.
- **Pinch Point** — a narrow funnel in the effect sketch where a few interception points cover a large area. Test there to get the most coverage for the least effort; it's also a sign of where natural encapsulation boundaries lie.

## Characterizing a Class

Beyond a single method: pick the interface, write tests that document the class's current behavior, look for things that confuse you, and add a test per discovery. Targeted testing — exercise each branch/path you intend to change before changing it.

## Key Principles

- Breaking dependencies is worth temporary ugliness
- Test coverage beats encapsulation when starting
- Wrap libraries to create seams
- Difficulty testing indicates design problems
- Production behavior becomes the specification
- Preserve signatures and make single-goal edits when working without tests — minimize the chance of human error
- Prefer the editing techniques (Sprout/Wrap) when you can't yet get code under test; prefer extraction once you can