---
name: clean-architecture
description: "Apply Clean Architecture principles from Robert C. Martin's book when designing or reviewing software architecture. Use when: (1) Designing application structure or layering, (2) Discussing or reviewing dependency direction, (3) Making architectural decisions about boundaries and components, (4) Refactoring toward cleaner boundaries, (5) Evaluating component cohesion and coupling. This skill encodes the key principles from 'Clean Architecture: A Craftsman's Guide to Software Structure and Design'."
---

# Clean Architecture Principles

Apply Robert C. Martin's Clean Architecture principles to build systems that are testable, independent of frameworks, and maintainable over time.

## Core Philosophy

- Architecture is about preserving options and deferring decisions
- Good architecture maximizes the number of decisions NOT made
- The goal is to minimize the human resources required to build and maintain systems
- Separate policy (business rules) from details (mechanisms of delivery)

---

## The Dependency Rule

**The most important rule in Clean Architecture.**

Source code dependencies must point only inward, toward higher-level policies.

- Nothing in an inner circle can know anything about an outer circle
- Data formats declared in outer circles should not be used by inner circles
- Outer circles are mechanisms; inner circles are policies

```
┌─────────────────────────────────────────────────┐
│  Frameworks & Drivers (Web, DB, Devices, UI)    │
│  ┌─────────────────────────────────────────┐    │
│  │  Interface Adapters (Controllers,       │    │
│  │  Gateways, Presenters)                  │    │
│  │  ┌─────────────────────────────────┐    │    │
│  │  │  Application Business Rules     │    │    │
│  │  │  (Use Cases)                    │    │    │
│  │  │  ┌─────────────────────────┐    │    │    │
│  │  │  │  Enterprise Business   │    │    │    │
│  │  │  │  Rules (Entities)      │    │    │    │
│  │  │  └─────────────────────────┘    │    │    │
│  │  └─────────────────────────────────┘    │    │
│  └─────────────────────────────────────────┘    │
└─────────────────────────────────────────────────┘
        Dependencies point INWARD →
```

---

## The Layers

### Entities (Enterprise Business Rules)

- Encapsulate enterprise-wide critical business rules
- Can be objects with methods or data structures with functions
- Least likely to change when something external changes
- Not affected by page navigation, security, or operational concerns

### Use Cases (Application Business Rules)

- Contain application-specific business rules
- Orchestrate data flow to and from entities
- Direct entities to use their enterprise-wide rules
- Changes here should NOT affect entities
- Changes to externals (DB, UI) should NOT affect use cases

### Interface Adapters

- Convert data between use cases/entities and external formats
- **Controllers**: Accept input, convert to use case format
- **Presenters**: Convert use case output to view format
- **Gateways**: Convert data for database or external services
- No business rules—pure data conversion

### Frameworks & Drivers

- Web frameworks, databases, UI frameworks, devices
- Glue code that connects to inner circles
- Keep this layer thin—minimal code beyond wiring

---

## Crossing Boundaries

### The Problem

Use cases need to call the database, but dependencies must point inward.

### The Solution: Dependency Inversion

1. Use case defines an interface (output port) for what it needs
2. Interface adapter implements that interface
3. Dependency points inward (adapter depends on use case interface)

```
┌──────────────┐         ┌──────────────┐
│   Use Case   │────────▶│  «interface» │
│              │         │  DataGateway │
└──────────────┘         └──────────────┘
                                △
                                │ implements
                         ┌──────────────┐
                         │   Database   │
                         │   Adapter    │
                         └──────────────┘
```

### Data Crossing Boundaries

- Use simple data structures (DTOs) to cross boundaries
- Don't pass Entity objects or database rows across boundaries
- Inner circles define the data structures they accept

---

## Component Principles

### Cohesion Principles

| Principle | Description | Guidance |
|-----------|-------------|----------|
| **REP** (Reuse/Release Equivalence) | Classes released together should be reusable together | Group by reuse potential |
| **CCP** (Common Closure) | Classes that change together belong together | Group by change reason |
| **CRP** (Common Reuse) | Don't force users to depend on things they don't use | Split unrelated classes |

**The tension**: REP and CCP make components larger (inclusion); CRP makes them smaller (exclusion). Balance based on project maturity—early projects favor CCP, mature projects favor CRP.

### Coupling Principles

| Principle | Description |
|-----------|-------------|
| **ADP** (Acyclic Dependencies) | No cycles in the component dependency graph |
| **SDP** (Stable Dependencies) | Depend in the direction of stability |
| **SAP** (Stable Abstractions) | Stable components should be abstract |

### Breaking Dependency Cycles

When you discover a cycle:
1. Apply Dependency Inversion—create an interface
2. Extract a new component that both depend on

---

## Boundaries

### What is a Boundary?

A line drawn between things that matter and things that don't (to each other).

### Drawing Boundaries

Draw boundaries that separate:
- Business rules from UI
- Business rules from database
- Business rules from frameworks

### Boundary Anatomy

- **Boundary Interface**: Defined by the component that uses it (inner circle)
- **Boundary Implementation**: Lives in the outer circle
- **Data Transfer Objects**: Simple structures crossing the boundary

### Partial Boundaries

When a full boundary is too expensive:
- **Skip the last step**: Keep components in same deployment, maintain separation
- **One-dimensional boundary**: Use Strategy pattern without reciprocal interface
- **Facade**: Simple interface hiding complex subsystem (weakest boundary)

---

## The Main Component

- The ultimate detail—the dirtiest, lowest-level component
- Creates all factories, strategies, and global facilities
- Hands control to high-level abstract components
- Think of Main as a plugin to the application

---

## Common Architectural Patterns

### Screaming Architecture

The architecture should scream its intent:
- A healthcare system's top-level structure should scream "Healthcare"
- NOT "Rails" or "Spring" or "ASP.NET"
- Frameworks are details, not the architecture

### The Humble Object Pattern

Split behavior at boundaries:
- **Humble Object**: Hard-to-test part, stripped to bare essentials
- **Testable Object**: All interesting behavior, easy to test
- Examples: Presenters (testable) vs Views (humble), Database Gateways (testable) vs Database (humble)

### Services and Microservices

Services are not inherently architectural:
- Function calls across service boundaries are still coupled
- Services can still be monolithic internally
- Apply Clean Architecture within each service
- Services are a deployment option, not an architecture

---

## Application Checklist

When designing or reviewing architecture, verify:

- [ ] Dependencies point inward (toward policy, away from details)
- [ ] Entities have no knowledge of outer circles
- [ ] Use cases don't know about UI, database, or frameworks
- [ ] Boundaries use dependency inversion (inner circle owns the interface)
- [ ] Data crossing boundaries uses simple structures (not entities or DB rows)
- [ ] No dependency cycles in the component graph
- [ ] Stable components are abstract; volatile components are concrete
- [ ] The architecture screams the domain, not the framework
- [ ] Main is a plugin that wires everything together
- [ ] Tests can run without UI, database, or external services