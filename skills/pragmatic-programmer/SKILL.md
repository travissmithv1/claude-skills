---
name: pragmatic-programmer
description: "Apply the philosophy and practices from Hunt & Thomas's 'The Pragmatic Programmer' (20th Anniversary Edition). Use when: (1) Reasoning about DRY (don't repeat yourself) and duplication of knowledge, (2) Designing for change — orthogonality, decoupling, ETC (easier to change), reversibility, (3) Choosing between tracer bullets and prototypes for an uncertain feature, (4) Tackling code quality habits — broken windows, programming by coincidence, design by contract, assertive programming, refactoring, tests as a design tool, naming, (5) Working pragmatically as a team — version control, automation, requirements, delighting users. Reach for this whenever someone discusses pragmatic engineering judgment, reducing coupling/duplication, building flexibility into a design, or taking responsibility for craft — even without naming the book."
---

# The Pragmatic Programmer

A philosophy of software craftsmanship: take responsibility, build software that's easy to change, and avoid the traps that erode quality. The book is a set of ~100 numbered **Tips**; the ones below are the load-bearing ideas. The throughline is *care* — pragmatic programmers think about what they're doing while they're doing it.

## Philosophy & Attitude

- **Take responsibility; provide options, don't make lame excuses.** "The Cat Ate My Source Code" — when something goes wrong, offer a path forward rather than a blame story.
- **Software Entropy — don't live with broken windows.** One unfixed bad design, bad decision, or piece of bad code signals neglect and invites more. Fix it, or board it up (a clear TODO/stub), so decay doesn't compound.
- **Be a catalyst for change (Stone Soup).** When you can't get buy-in for the whole thing, start something reasonable and let others join once they see it take shape.
- **Good-Enough Software.** Build quality in but know when to stop gold-plating; involve users in the quality/scope/time trade-off. "Good enough" means good enough for the users, the maintainers, and your own peace of mind.
- **Invest regularly in your Knowledge Portfolio**, and **communicate** — knowing what you're talking about is worthless if you can't convey it. Know your audience (the WISDOM acrostic).

## A Pragmatic Approach (the core design values)

- **ETC — Easier To Change.** The single underlying value: every design guideline is a special case of "does this make the system easier to change?" When unsure between two designs, pick the one that keeps more options open.
- **DRY — Don't Repeat Yourself.** Every piece of *knowledge* must have a single, unambiguous, authoritative representation. DRY is about duplicated *knowledge/intent*, not duplicated *text* — two identical lines that mean different things aren't a violation; two different expressions of the same rule are. Watch for imposed, inadvertent, impatient, and inter-developer duplication. **Make it easy to reuse.**
- **Orthogonality.** Eliminate effects between unrelated things; keep components independent and self-contained so a change in one doesn't ripple. Benefits: productivity (combine independent parts) and reduced risk (isolated, testable, decoupled). Ask: "if I change this, how many things break?"
- **Reversibility.** There are no final decisions. Avoid baking a vendor, framework, or assumption deep into the code; hide third-party APIs behind your own abstraction so you can switch.
- **Tracer Bullets vs Prototypes.** A **tracer bullet** is a thin, end-to-end, *production-quality* skeleton that connects all layers and grows into the real system — use it when you're building in the dark and need to confirm you're hitting the target. A **prototype** is *disposable* code to learn about one risky aspect (UI, algorithm, feasibility) — write it to be thrown away; if you can't throw it away, it wasn't a prototype.
- **Domain Languages.** Program close to the problem domain; consider mini-languages/DSLs to express intent in the user's terms.
- **Estimating.** Give estimates with units that convey confidence ("about 130 working days" ≠ "6 months"); iterate the schedule with the code; track your estimates to get better.

## Pragmatic Paranoia (defensive design)

- **You can't write perfect software — design by contract.** State preconditions, postconditions, and invariants; be strict in what you accept and what you promise.
- **Dead Programs Tell No Lies — crash early.** A program that has detected an impossible state should stop, not limp on corrupting data. Catch only exceptions you can actually handle.
- **Assertive Programming.** Use assertions to verify the impossible-shouldn't-happen; leave them on where it matters. Don't use assertions for normal error handling.
- **Take small steps, always; don't outrun your headlights.** Get feedback before the next step. Be wary of estimates and designs that reach too far into an unknowable future.
- **Decoupling and resource balance** — finish what you start (the routine that allocates a resource frees it); act locally; keep the scope of mutable state small.

## Bend or Break (keeping code flexible)

- **Decoupling & the Law of Demeter — don't chain method calls / "tell, don't ask."** A response object should give an object that does the next thing, not let you reach through it. Minimize what each unit knows about the structure of others.
- **Avoid global data; if it must be global, wrap it in an API.** Globals are coupling in disguise.
- **Temporal coupling — design for concurrency.** Two things forced to happen in a fixed order, or at the same time, are coupled in time; analyze workflow to find what can run independently.
- **Juggling the real world with events.** Decouple producers from consumers with Finite State Machines, the Observer pattern, Publish/Subscribe, and reactive/streams. **"It's just a view"** — separate the model from the views/controllers that present it; a view is an observer.
- **Transforming Programming — program as a series of transformations** (pipelines: input → series of transforms → output). It clarifies data flow and exposes hidden steps.
- **Inheritance Tax — don't pay it.** Prefer interfaces, delegation, mixins/traits over deep inheritance hierarchies to share behavior. Inheritance is coupling.
- **Configuration — parameterize your app with external config** for anything that may change between deployments/environments.

## While You Are Coding

- **Don't program by coincidence.** Rely on documented behavior you understand, not on what happens to work. Know *why* your code works; if you can't explain it, you don't yet rely on it — you're being lucky.
- **Estimate the order (Big-O) of your algorithms,** and test your estimates against reality.
- **Refactor early, refactor often.** Treat refactoring like gardening, not a "fix it later" event; do it in small steps under green tests; don't mix refactoring with adding features.
- **Testing is about design, not just bugs — test your software, or your users will.** Code that's hard to test is badly designed; write tests to *think about the interface* (TDD). Use **property-based testing** to find assumptions you didn't know you made, and **test the boundaries**. Coverage of state, not lines.
- **Name well.** Names carry intent and culture; honor the conventions of the domain; rename the moment a name stops fitting. Naming is one of the two hard things.
- **Keep knowledge in plain text** and master the basic tools (shell, editor, version control, debugging) — they're the engineer's leverage.

## Before & Around the Project

- **Don't gather requirements — dig for them.** Requirements are buried under assumptions and politics; work *with* users to uncover the underlying need ("requirements are learned in a feedback loop"). Maintain a project glossary.
- **Work with users to think like a user.** Document the *why* behind requirements, not just the *what*.
- **Pragmatic Teams** apply the same principles at team scale: no broken windows, communicate, DRY across people, organize teams around functionality, automate.
- **The Pragmatic Starter Kit** — three pillars that must be automatic: **Version Control everything**, **ruthless testing**, and **full build/release automation**. Don't use manual procedures.
- **Delight users; sign your work.** Deliver outcomes that exceed expectations, and take pride and ownership of what you build.

## How to Use This Skill

1. When making a design choice, ask the two pragmatic questions: *"Is this DRY?"* and *"Does this make the system easier to change (ETC)?"* They resolve most decisions.
2. When facing uncertainty, decide deliberately between a **tracer bullet** (build the real skeleton end-to-end) and a **prototype** (throwaway probe of one risk) — and never let a prototype harden into production.
3. Treat coupling as the enemy: apply orthogonality, Law of Demeter / "tell don't ask," wrap third-party and global dependencies, and break temporal coupling.
4. Guard quality continuously: fix broken windows, crash early, assert the impossible, refactor in small steps under tests, and never program by coincidence.
