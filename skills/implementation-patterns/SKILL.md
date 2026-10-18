---
name: implementation-patterns
description: "Apply Kent Beck's 'Implementation Patterns' when writing day-to-day code that others must read — the small, local decisions about classes, state, behavior, methods, and collections. Use when: (1) Naming and shaping a method (Composed Method, Intention-Revealing Name, guard clauses), (2) Deciding how to store and expose state (fields, getters/setters, safe copy, common vs variable state), (3) Choosing how objects communicate (messages, double dispatch, delegation, pluggable selector), (4) Picking a collection type or interface, (5) Reasoning about whether code 'communicates intent' to a reader. Use whenever someone asks how to write code that clearly expresses intent, or weighs small structural choices through the lens of communication, simplicity, and flexibility."
---

# Implementation Patterns

Kent Beck's guide to writing code that communicates. The core idea: **programming is a form of communication** — you write for the next person (often you) who must understand and change the code. These patterns are the small, recurring decisions that make code speak clearly.

## Values (why we make any choice)

Every implementation decision serves one of three values. When patterns conflict, rank by these:

- **Communication** — code communicates well when a reader can understand and change it. The dominant value; readers cost more than writers.
- **Simplicity** — remove excess complexity so what remains speaks. "Eliminate accidental complexity; reveal essential complexity." Don't let simplicity for the writer create complexity for the reader.
- **Flexibility** — keep options open, but only the flexibility you actually need now. Most "flexible" code is speculative and costs communication. Flexibility is best bought through proven simplicity, not added abstraction.

## Principles (the bridge from values to patterns)

When a pattern doesn't obviously apply, reason from these:

- **Local Consequences** — structure code so a change's effects stay local; this keeps the cost of change low and reading tractable.
- **Minimize Repetition** — repeated code must change in lockstep, spreading consequences. Split, extract, unify so each fact lives once.
- **Logic and Data Together** — put logic next to the data it works on, ideally in the same method, object, or at least package. (Feature Envy is the violation.)
- **Symmetry** — express the same idea the same way everywhere; group symmetric operations (add/remove, open/close) so readers can see the pattern.
- **Declarative Expression** — say *what*, not *how*, where you can. Readers absorb declarations faster than control flow.
- **Rate of Change** — group things that change at the same rate/time; separate things that change for different reasons. (This is SRP from the data side.)

## Class

- **Class** — bundle related logic and data; name to communicate purpose and intent, not implementation.
- **Simple Superclass Name** — short, evocative names for superclasses (root of a metaphor). **Qualified Subclass Name** — longer names for subclasses that say how they specialize.
- **Abstract Interface** — separate interface from implementation only when variation actually exists; don't add interfaces speculatively.
- **Versioned Interface** — extend an interface safely by versioning when you can't change all implementers.
- **Value Object** — immutable, equality-by-value object; operations return new instances. Easy to reason about and share.
- **Specialization (Subclass / Implementor / Inner Class / Instance-Specific Behavior)** — express variation; prefer the lightest form. Use **Conditional** only for small, local variation; reach for **Delegation** or **Pluggable Selector** as variation grows.
- **Library Class** — collect stateless helper functions when behavior doesn't belong on any object.

## State

How to store and reveal an object's data:

- **State** — store data for later use; the amount and lifetime of state is a key design axis.
- **Access** — always go through accessing methods, even inside the class, so storage can change without rippling. **Direct vs Indirect Access** — read fields directly only where simplicity clearly wins.
- **Common State** — fields every instance has. **Variable State** — a map for state only some instances have. **Extrinsic State** — state kept outside the object (in a map keyed by it) when it doesn't belong to the object.
- **Getting / Setting Method** — provide only those that communicate intent; not every field needs both. Prefer setting state in the constructor.
- **Safe Copy** — copy data crossing a boundary so external mutation can't corrupt your state (defensive copy of mutable collections/values).

## Behavior

How control and messages flow:

- **Control Flow** — express computation as a **Main Flow** with **Exceptional Flow** clearly separated, so the common path reads top to bottom.
- **Message** — invoking a method is the basic unit; choose messages that explain the computation. **Explaining Message** — wrap a low-level call in an intention-named method so the call site reads as intent.
- **Choosing Message** — use polymorphism (a chosen message) instead of conditionals to pick behavior. **Double Dispatch** — vary behavior on two types. **Decomposing / Reversing / Inviting Message** — split, invert, or open a method for extension.
- **Guard Clause** — handle edge cases with early returns at the top, keeping the main flow un-nested. Prefer to nested `if/else`.
- **Exception** — signal that the main flow can't continue; **Checked Exceptions** sparingly (they couple callers); **Exception Propagation** — translate exceptions at layer boundaries so each layer throws in its own terms.

## Method

The most-used patterns; this is where communication is won or lost:

- **Composed Method** — divide a method into calls to other methods, each at one level of abstraction and named for intent. The single most important method pattern: a reader should understand a method without diving into its callees.
- **Intention-Revealing Name** — name a method for *what it accomplishes* (its intent), not how.
- **Method Visibility** — expose the least that works; private until proven otherwise.
- **Method Object** — turn a tangled method with many locals into a class whose fields are those locals, then Compose it.
- **Overridden / Overloaded Method** — use to express variation/symmetry; keep overloads truly equivalent in meaning.
- **Method Return Type** — return the most abstract type that serves the caller, to keep flexibility and hide implementation.
- **Method Comment** — only when the code genuinely can't say it (rationale, surprising constraints); a needed comment is often a refactor signal.
- **Helper Method** — extract to make the caller read clearly, even if used once.
- **Conversion** — express a type change as a **Conversion Method** (on the source) or **Conversion Constructor** (on the target); pick by where readers will look.
- **Creation** — prefer a **Complete Constructor** that yields a fully-valid object; use a **Factory Method** when creation needs a name or polymorphism, and an **Internal Factory** to let subclasses vary creation.
- **Collection Accessor Method** — never expose a raw mutable collection; return a copy or an unmodifiable view and provide add/remove methods so invariants hold.
- **Boolean Setting Method** — name state-setting methods for the state, not the boolean (`enable()`/`disable()`, not `setEnabled(true)`).
- **Query Method** — a method returning a boolean that reads as a question (`isEmpty()`), separate from commands (Command-Query Separation).
- **Equality Method** — implement equality (and hashing) together and by value when objects represent values.
- **Debug Print Method** — a readable `toString`/print for the object's essential state, to aid the next debugger.

## Collections

Choosing a collection *is* a design decision that communicates intent:

- **Interface over implementation** — declare variables as the most abstract collection interface that fits (Iterable → Collection → List/Set/Map), revealing only the properties that matter.
- Choose by the property you mean to communicate: **List** (order + duplicates), **Set** (uniqueness), **SortedSet** (ordering by comparison), **Map** (keyed lookup).
- Choose the *implementation* by performance characteristics only after the interface expresses intent (array-backed vs linked vs hashed vs tree).

## Evolving Frameworks

When writing code others extend: prefer adding to interfaces compatibly, keep extension points explicit and few, and let real usage — not speculation — pull abstraction into existence. Flexibility you didn't need is complexity the reader pays for.

## How to Use This Skill

1. Ask "what is this code trying to say?" before "does it work?" — optimize the reader's path.
2. When a method is hard to read, reach first for **Composed Method** + **Intention-Revealing Name** + **Guard Clause**.
3. When choosing between options (conditional vs polymorphism, getter vs constructor-set, which collection), pick the one that communicates intent with the least complexity; add flexibility only against a present need.
4. Use the principles to break ties: keep consequences local, kill repetition, keep logic with its data, prefer symmetry and declarative form, group by rate of change.
