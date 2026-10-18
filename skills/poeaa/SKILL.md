---
name: poeaa
description: "Apply the patterns from Martin Fowler's 'Patterns of Enterprise Application Architecture' (PoEAA) when designing the internals of a server-side business application. Use when: (1) Deciding where to put business/domain logic (Transaction Script vs Domain Model vs Table Module), (2) Designing data-access / object-relational mapping (Active Record, Data Mapper, Unit of Work, Identity Map, Repository, Lazy Load), (3) Structuring layers (presentation / domain / data source) and a Service Layer, (4) Handling web request flow (Page/Front Controller, Template/Transform View), distribution (Remote Facade, DTO), concurrency (Optimistic/Pessimistic Offline Lock), or session state. Reach for this whenever someone asks how to organize an enterprise app's layers, ORM mapping, or domain-logic placement, even if they don't name the patterns."
---

# Patterns of Enterprise Application Architecture

Fowler's catalog for the insides of an enterprise application: rich domain logic, lots of (often messy) data, and concurrent access through many screens. The value is less in any one pattern than in *choosing* between competitors. Most decisions trade simplicity now against scalability of complexity later — name the forces, pick the lightest pattern that fits.

## The Layering Narrative

Three principal layers. Each may only depend downward; the domain must not know about presentation.

- **Presentation** — handle requests, render UI/HTTP/CLI responses.
- **Domain (business logic)** — the actual work the app does: validation, calculation, decisions.
- **Data Source** — talk to DB, messaging, other apps.

The hard question is always *where does a given piece of logic go* and *how thick is each layer*. Keep domain logic out of the presentation layer above all.

## Domain Logic Patterns — the central choice

Pick based on the **complexity** of the business logic, not the size of the data.

- **Transaction Script** — organize logic as one procedure per request/action. Simple, fast to start, obvious. Degrades into duplication as logic grows. Default for thin, mostly-CRUD logic.
- **Domain Model** — a web of interconnected objects each modeling a concept, with both data and behavior. Handles complex, changing rules well; steeper learning curve and needs real O/R mapping. Default for rich, growing business logic.
- **Table Module** — one class per table handling the business logic for all rows, working over a Record Set. A middle ground that fits tooling built around tabular data sets (e.g. classic .NET DataSet).
- **Service Layer** — a thin boundary of coarse-grained operations over the domain, defining the app's transaction and use-case boundary. Use when multiple clients/UIs hit the same logic or you need a clear transactional API. Can be a thin façade (logic in Domain Model) or hold its own orchestration logic.

> Rule of thumb: as domain logic complexity rises, the payoff curve favors Domain Model over Transaction Script — but Domain Model's setup cost is real, so don't reach for it for trivial apps.

## Data Source Architectural Patterns — how objects meet the DB

- **Row Data Gateway** — an object that is a single row, with a finder elsewhere. One instance per row.
- **Table Data Gateway** — one object per table; methods take/return Record Sets. Pairs naturally with Table Module.
- **Active Record** — a domain object that carries its own data *and* its own CRUD/db logic. Great with Transaction Script or a simple Domain Model where object structure maps 1:1 to tables. Breaks down when the domain model diverges from the schema.
- **Data Mapper** — a separate mapping layer moves data between objects and DB, keeping the Domain Model ignorant of the database entirely. The right choice for a complex Domain Model; what full ORMs implement.

## Object-Relational Behavioral Patterns

How to coordinate reads/writes correctly and efficiently:

- **Unit of Work** — track every object touched in a business transaction; figure out the minimal set of inserts/updates/deletes and commit them together. The keystone of correct, efficient persistence.
- **Identity Map** — keep a map of loaded objects so each row is loaded once; guarantees identity and avoids redundant reads and inconsistent in-memory copies.
- **Lazy Load** — an object that doesn't hold all its data but knows how to fetch it on first access (Lazy Initialization, Virtual Proxy, Value Holder, Ghost). Avoid the N+1 trap it can cause.

## Object-Relational Structural Patterns (mapping)

- **Identity Field** — store the DB key in the object to maintain identity.
- **Foreign Key Mapping** — map an object reference to a foreign key column.
- **Association Table Mapping** — map a many-to-many with a link table.
- **Dependent Mapping** — let one class do the mapping for a child that has no independent life (e.g. line items owned by an order).
- **Embedded Value** — map a value object's fields into the owner's table columns (e.g. an Amount → currency+value columns).
- **Serialized LOB** — save a cluster of objects as one serialized blob/clob in a column.
- **Single Table Inheritance** — one table for a whole hierarchy (sparse columns, simple, no joins).
- **Class Table Inheritance** — one table per class, joined on a shared key (normalized, more joins).
- **Concrete Table Inheritance** — one table per concrete class (no joins, but schema churn on superclass change).
- **Inheritance Mappers** — structure the mapper classes to mirror the inheritance hierarchy.
- **Mapper** — a base pattern: an object that sets up communication between two independent objects/layers (see Base Patterns).

## Object-Relational Metadata Mapping

- **Metadata Mapping** — hold mapping details (column ↔ field) as data/metadata, not hand-written code. The engine behind real ORMs.
- **Query Object** — an object representing a query in domain terms, translated to SQL; hides SQL and schema from the domain.
- **Repository** — mediates between domain and mapping layers with a collection-like interface for accessing domain objects; clients build criteria/specifications, the Repository turns them into queries. Use to keep query logic out of the domain and centralize access.

## Web Presentation Patterns

- **Model View Controller (MVC)** — split input controller, model, and view; the backbone.
- **Page Controller** — one controller per logical page/action. Simple; fine for mostly-static navigation.
- **Front Controller** — a single handler funnels all requests, then dispatches to commands. Centralizes cross-cutting concerns (auth, routing); better for complex sites.
- **Template View** — render by embedding markers in HTML (JSP/ERB/Razor style). Intuitive but can leak logic into the page.
- **Transform View** — transform domain data into output element-by-element (e.g. XSLT). Easier to test, harder for designers.
- **Two Step View** — render in two stages (logical screen → physical HTML) for consistent site-wide presentation.
- **Application Controller** — a centralized point for screen navigation and flow-of-control (wizards, state machines).

## Distribution Patterns

- **First Law of Distributed Object Design: don't distribute your objects.** In-process calls are millions of times cheaper than remote ones — design coarse interfaces only at real process boundaries.
- **Remote Facade** — a coarse-grained façade over fine-grained domain objects to make remote calls economical. Holds no domain logic, only translation/aggregation.
- **Data Transfer Object (DTO)** — a dumb object carrying a batch of data across a process boundary in one call, with an Assembler moving data between DTO and domain objects.

## Offline Concurrency Patterns

For business transactions that span multiple system (request) transactions:

- **Optimistic Offline Lock** — detect conflict at commit via a version field; assume conflicts are rare. Default for low-contention.
- **Pessimistic Offline Lock** — acquire a lock up front to prevent conflict; use when conflicts are likely or rework is expensive.
- **Coarse-Grained Lock** — lock a group of related objects (an aggregate) with one lock.
- **Implicit Lock** — acquire locks in framework/supertype code so application developers can't forget.

## Session State Patterns

- **Client Session State** — store session data on the client. Most scalable server-side; watch size and security.
- **Server Session State** — keep it in memory on the server. Simplest; complicates clustering/failover.
- **Database Session State** — push session data to the DB between requests. Scales statelessly; adds DB load and latency.

## Base Patterns (building blocks used throughout)

- **Gateway** — an object that encapsulates access to an external system or resource behind a simple interface.
- **Mapper** — set up communication between two subsystems that stay ignorant of each other.
- **Layer Supertype** — a superclass for all types in a layer to hold common features.
- **Separated Interface** — define an interface in one package, implement it in another, to break dependency direction.
- **Registry** — a well-known object other objects use to find common services/objects (a global, used judiciously).
- **Value Object** — a small object (Money, date range, point) whose equality is by value, not identity; immutable.
- **Money** — represent monetary amounts with explicit currency and integer-safe arithmetic; never use floating point for money.
- **Special Case** — a subclass providing special behavior for particular cases (a Null Object is one), replacing null checks.
- **Plugin** — link classes during configuration rather than compilation so behavior swaps by environment.
- **Service Stub** — replace a problematic external service with a stand-in for testing/dev (a.k.a. Mock/Fake at the boundary).
- **Record Set** — an in-memory tabular representation of data, the currency between Table Module and Table Data Gateway.

## How to Use This Skill

1. Name the dominant force: how complex is the domain logic, how much concurrency, is it distributed, how does the schema relate to the object model?
2. Choose the domain-logic pattern first — it cascades into the data-source choice (Transaction Script + Active Record/Gateway; rich Domain Model + Data Mapper + Unit of Work + Identity Map).
3. Add only the patterns the forces justify. Most apps don't need offline locking, distribution, or Two Step View. Resist applying a pattern because it's elegant — apply it because a force demands it.
4. Keep layers honest: no domain logic in controllers, no SQL in the domain, no presentation knowledge below presentation.
