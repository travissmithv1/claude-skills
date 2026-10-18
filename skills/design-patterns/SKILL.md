---
name: design-patterns
description: "Apply the 23 'Gang of Four' design patterns from Gamma, Helm, Johnson & Vlissides' 'Design Patterns: Elements of Reusable Object-Oriented Software'. Use when: (1) Choosing or naming an object-oriented design pattern (Factory, Builder, Singleton, Adapter, Decorator, Composite, Proxy, Observer, Strategy, State, Command, Visitor, etc.), (2) Deciding how to create, compose, or vary objects flexibly, (3) Recognizing that a design problem matches a known pattern and weighing its consequences, (4) Disambiguating similar patterns (Strategy vs State, Adapter vs Bridge, Decorator vs Proxy). Reach for this whenever someone asks 'what pattern fits here', wants to make a design more flexible/extensible through delegation or polymorphism, or names any classic GoF pattern — even informally."
---

# Design Patterns (Gang of Four)

The 23 patterns are named, proven solutions to recurring object-oriented design problems. A pattern names a problem, a solution, and its trade-offs (consequences) so designers share vocabulary. Don't apply a pattern because it's clever — apply it when its problem is actually present and you'll pay the indirection it adds.

## Two Principles Behind Every Pattern

1. **Program to an interface, not an implementation.** Depend on an abstract type; let concrete classes vary behind it. Most patterns are mechanisms for honoring this.
2. **Favor object composition over class inheritance.** Inheritance is static and exposes internals; composition (delegation) varies behavior at runtime and keeps classes focused. Many patterns replace a subclass explosion with a composed object.

A third recurring idea: **encapsulate the concept that varies.** Find what changes, isolate it behind an interface, and the rest of the system stops caring.

## Classify by Purpose and Scope

- **Creational** — abstract the instantiation process (which class, how many, when).
- **Structural** — compose classes/objects into larger structures.
- **Behavioral** — assign responsibilities and define how objects communicate.

Scope: *class* patterns use inheritance (fixed at compile time); *object* patterns use composition (changeable at runtime, more flexible).

---

## Creational Patterns

- **Abstract Factory** — provide an interface for creating *families* of related objects without naming concrete classes. Use when a system must be independent of how its products are created and you swap whole families (e.g. UI toolkit per OS). Adding a new product type is hard; adding a new family is easy.
- **Builder** — separate construction of a complex object from its representation so the same process builds different representations. Use for objects assembled in steps or with many optional parts.
- **Factory Method** — define a method for creating an object but let subclasses decide which class to instantiate. Use when a class can't anticipate the class of objects it must create. The class-scoped sibling of Abstract Factory.
- **Prototype** — create new objects by cloning a prototypical instance. Use when instantiation is expensive or classes are specified at runtime; avoids a parallel factory hierarchy.
- **Singleton** — ensure a class has one instance with a global access point. Use sparingly — it's global state and complicates testing; prefer dependency injection where you can.

## Structural Patterns

- **Adapter (Wrapper)** — convert one interface into another a client expects. Use to reuse an existing class whose interface doesn't match. Class Adapter uses inheritance; Object Adapter uses composition (more flexible).
- **Bridge** — decouple an abstraction from its implementation so the two vary independently. Use when both an abstraction and its implementation have multiple dimensions of variation, to avoid a combinatorial subclass explosion.
- **Composite** — compose objects into tree structures and let clients treat individual objects and compositions uniformly. Use for part-whole hierarchies (files/folders, UI widgets).
- **Decorator (Wrapper)** — attach responsibilities to an object dynamically by wrapping it in objects with the same interface. Use as a flexible alternative to subclassing for extension; stack decorators to combine features.
- **Facade** — provide a unified higher-level interface to a subsystem. Use to simplify and decouple clients from a complex subsystem.
- **Flyweight** — share fine-grained objects to support large numbers efficiently by separating intrinsic (shared) from extrinsic (context) state. Use when object count is huge and most state can be externalized.
- **Proxy (Surrogate)** — provide a placeholder controlling access to another object. Variants: Virtual Proxy (lazy/expensive creation), Remote Proxy, Protection Proxy, Smart Reference. Same interface as the subject (unlike Decorator, it controls rather than adds).

## Behavioral Patterns

- **Chain of Responsibility** — pass a request along a chain of handlers until one handles it. Use to decouple sender from receiver when more than one object may handle a request.
- **Command** — encapsulate a request as an object, enabling queuing, logging, and undo/redo. Use to parameterize objects with operations and decouple invoker from receiver.
- **Interpreter** — represent a grammar and interpret sentences in it. Use for simple, stable languages (expression evaluators); doesn't scale to complex grammars.
- **Iterator (Cursor)** — access elements of an aggregate sequentially without exposing its representation. Use to traverse a collection many ways.
- **Mediator** — encapsulate how a set of objects interact via a central mediator so they don't refer to each other directly. Use to reduce many-to-many coupling (e.g. dialog controls).
- **Memento (Token)** — capture and externalize an object's internal state without violating encapsulation, so it can be restored later. Use for undo/checkpoints.
- **Observer (Publish-Subscribe)** — define a one-to-many dependency so dependents are notified automatically when a subject changes. Use to keep collaborating objects consistent without tight coupling.
- **State** — let an object alter its behavior when its internal state changes; it appears to change class. Use to replace large state-driven conditionals with state objects that handle their own transitions.
- **Strategy (Policy)** — define a family of interchangeable algorithms and make them swappable at runtime. Use when you need variants of an algorithm and want to choose one without conditionals.
- **Template Method** — define the skeleton of an algorithm in a base method, deferring some steps to subclasses. Use to factor out the common structure and vary only the steps (the Hollywood Principle: "don't call us, we'll call you").
- **Visitor** — represent an operation to perform on elements of an object structure, letting you add new operations without changing the elements. Use when a structure is stable but operations change often; adding new element types is then hard.

---

## Choosing and Disambiguating

Same structure, different intent — pick by *why*, not by class diagram:

- **Strategy vs State** — both delegate to a swapped object. Strategy: the client picks an algorithm; strategies don't know about each other. State: the object's *own* changing state drives behavior, and states manage transitions between themselves.
- **Adapter vs Bridge** — Adapter makes an existing interface fit *after the fact*; Bridge is designed up front to let abstraction and implementation vary independently.
- **Decorator vs Proxy** — both wrap with the same interface. Decorator *adds* responsibilities; Proxy *controls access* (and often creates/locates the subject).
- **Decorator vs Strategy** — Decorator changes the skin (wraps from outside); Strategy changes the guts (an injected component). Use Strategy when you can't or don't want to wrap the whole object.
- **Facade vs Adapter** — Facade defines a new simpler interface to a subsystem; Adapter conforms to an *existing* expected interface.
- **Abstract Factory vs Factory Method** — Factory Method uses inheritance (a subclass chooses the product); Abstract Factory uses composition (an injected factory object creates a whole family).
- **Composite + Iterator/Visitor** — Composite gives the tree; Iterator traverses it; Visitor adds operations over it.
- **Command vs Strategy** — both encapsulate behavior as an object; Command emphasizes invoking/queuing/undoing a *request*, Strategy emphasizes swapping an *algorithm*.

## How to Use This Skill

1. State the problem in terms of what varies or what's coupled — that points to a category (creation? structure? communication?).
2. Match to a pattern by *intent*, then check the **consequences**: every pattern adds indirection. Confirm the flexibility is needed now or clearly imminent.
3. Prefer the lightest option — often plain composition, a function, or polymorphism beats a named pattern. Patterns are a destination reached by need, not a starting point (see also pattern-directed refactoring).
4. Implement to an interface and inject collaborators so the pattern stays testable and swappable.
