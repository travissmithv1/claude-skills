---
name: user-stories
description: Generate user stories in a consistent template for manual copy/paste into Jira. Use whenever the user asks to write, draft, outline, or create user stories, acceptance criteria, or Jira tickets for a feature. Produces stories with a persona-based value statement, outcome-focused acceptance criteria (describing WHAT, not HOW), and optional engineer notes. Enforces thin-slicing so every story is completable in under a week. Also use this skill when breaking a larger feature into implementable stories. Do NOT use this skill when the user specifically asks for a Jira CSV import file — that's a separate workflow.
---

# User Stories

A skill for writing Jira user stories that are thin-sliced, persona-driven, and outcome-focused. Output is formatted text intended for manual copy/paste into Jira — no CSV, no Jira wiki markup, no Jira-specific fields like priority or story points.

## The template

Every story uses exactly these sections, in this order. Engineer Notes is optional and is omitted entirely when there's nothing useful to add — don't pad it.

```
Summary: <short title>

Value Statement: As a <persona>, I want <capability> so that <outcome>.

Acceptance Criteria:
* <observable criterion>
* <observable criterion>
  * <sub-criterion, if it belongs nested>

Engineer Notes:
* <technical consideration>
* <technical consideration>
```

## How to write each section

### Summary

A short, descriptive title — ideally under about 8 words. Name the thing being built or changed. Skip filler like "Implement" or "Add" unless it genuinely clarifies intent. Use the project's domain vocabulary.

### Value Statement

A single sentence in the form: `As a <persona>, I want <capability> so that <outcome>.`

The persona must be someone who actually interacts with or benefits from this capability — not a generic "user". Use the project's established personas (member, instructor, engineer, admin, analyst, etc.). If the persona isn't obvious from context, ask before writing the story rather than guessing.

The outcome is the *why* — the business or user goal, not a restatement of the capability.
* Good: "so that I can plan my week around the classes I've committed to"
* Bad: "so that I can see the list of classes" (that's just the capability again)

### Acceptance Criteria

Describe the state of the system when the story is complete. Each bullet is something observable or verifiable.

**Write WHAT, not HOW.** The engineer owns implementation decisions. Criteria that prescribe the solution constrain them unnecessarily and make the story brittle when the engineer finds a better approach during implementation.

* Good: "A list of upcoming booked classes is displayed"
* Bad: "A React component renders a paginated table fed from the `/bookings` endpoint"

* Good: "An alarm is triggered when 10 or more admin modifications occur in a 30 minute period by a single IP address"
* Bad: "A Lambda function polls CloudWatch Logs every 5 minutes and posts to Slack via webhook"

Include edge cases and non-functional requirements when they define completion — mobile support, empty states, permissions, error handling — but only when they're part of *this* slice. Leave out anything that belongs to a later story.

Criteria must be specific and testable. Fuzzy words like "fast", "intuitive", or "scalable" belong in a design conversation, not in an AC line. If you'd need more context to write a test for it, rewrite it.

### Engineer Notes (optional)

Technical context the engineer may want to consider but that isn't part of the definition of done. Good uses:
* Scope boundaries ("Filtering and searching is not part of this card")
* Account or role constraints ("Member account type only, not instructor accounts")
* Relevant data sources or existing code areas to reference
* Gotchas or areas to watch

Do **not** use Engineer Notes to encode cross-story relationships — "depends on story 5", "blocks SF-42", "do after the auth story". Those relationships live in Jira as issue links, and putting them in the story body means they go stale the moment someone reorders the backlog. If ordering or dependencies matter, surface them in the chat response (see Output format), not inside the story.

Omit this section entirely when there's nothing useful to say. An empty "Engineer Notes:" header is worse than none.

## Thin-slicing

Every story should be completable by one engineer (or pair) in under a week of focused work. If it feels bigger, split it.

Useful splits:
- **By persona** — one story for the member view, another for the admin view
- **By capability depth** — read-only view first, then add/edit, then delete
- **By platform** — desktop first, then mobile adjustments (only if they're genuinely separate work, not a single responsive layout)
- **By data shape** — happy path with required fields first, then validation / edge cases / optional fields
- **By integration** — stub the external call or use a fixture first, then wire up the real one

A story is probably too big if any of these are true:
- More than roughly 7 AC bullets
- It touches unrelated areas (auth *and* new UI *and* a new data model)
- It would take a pair more than a few days of focused work
- You can describe its completion with more than one "so that"

When the user describes something that's clearly multi-story, propose the split *before* writing any single story in full. A numbered sequence with one-line descriptions is enough to confirm direction — then write them out one by one.

## Workflow

When the user asks for one or more stories:

1. **Clarify the persona** if it isn't obvious from context. A quick "Who is this for — member, instructor, or someone else?" is better than guessing.
2. **Gauge scope.** If the request is large ("build the class waitlist feature"), propose a thin-sliced set of stories with short descriptions and a suggested order *before* writing any in full. If the request is already story-sized, write it directly.
3. **Write the story.** Use the exact template. Keep Summary short. Keep AC focused on WHAT, not HOW.
4. **Name assumptions briefly.** After the story, call out any assumptions made — persona, scope boundaries, anything ambiguous. Keep it to a few lines.
5. **Offer the next slice.** If the story is part of a larger sequence, mention the next 1–2 stories without writing them in full yet, so the user can confirm direction before investing more detail.

Don't add Jira fields (priority, story points, labels, components, epic links, reporter, assignee) unless the user explicitly asks. Those are manual fields the user sets in Jira; including them in the story body just adds cleanup on paste.

## Output format

Render each story as formatted text with real bullets, not inside a code fence. Keep section labels plain ("Summary:", "Value Statement:", "Acceptance Criteria:", "Engineer Notes:") so the structure is obvious when pasted into Jira's editor. If returning multiple stories, label them (Story 1, Story 2, …) and list any ordering or dependencies at the end.

## Examples

**Example 1 — feature-scoped story**

Summary: My Class Schedule

Value Statement: As a member, I want to view and manage my upcoming class bookings in StudioFlow so that I can plan my week around the classes I've committed to and avoid late-cancellation fees.

Acceptance Criteria:
* A list of upcoming booked classes is displayed
* Each booking includes:
  * Class name, instructor, location, and start time
* Sidebar navigation is added to navigate to the My Schedule area
* A mobile-friendly version of the page is also created

Engineer Notes:
* This is for the member account type only, not for instructor accounts
* Filtering and searching bookings is not part of this card

*Why this works:* The AC "A list of upcoming booked classes is displayed" describes the outcome without prescribing a component library, layout, or API shape. Engineer Notes carves scope without polluting the AC. Mobile support is called out explicitly so it's part of "done", not an afterthought.

**Example 2 — operational / infrastructure story**

Summary: Admin Modifications

Value Statement: As an engineer, I want to be alerted when suspicious admin data modifications are occurring so that I can ensure integrity of the system and data.

Acceptance Criteria:
* An alarm is triggered when 10 or more admin area data modifications occur in a 30 minute period by a single IP address
* The #studioflow-security-alerts channel is notified

Engineer Notes:
* Focus on any modifications to the Admin area

*Why this works:* The AC pins down the *what* of the alert — threshold, window, source, destination — without specifying CloudWatch vs. Datadog, webhook vs. bot, push vs. poll. The engineer owns that call. A non-engineer persona wouldn't fit here; "engineer" is the correct audience because they're the one benefiting from the alert.

## Anti-patterns to catch in your own output

Before returning a story, scan it for these:

- **AC describes implementation.** Words like "endpoint", "component", "Lambda", "table", "service", "webhook" in an AC bullet are a strong signal to rewrite in terms of observable behavior.
- **Persona is "user".** Almost never correct. Name the actual role.
- **Outcome restates the capability.** "So that I can see X" where the capability is "show X" is empty. Ask what the persona does with X.
- **Fuzzy ACs.** "Fast", "intuitive", "robust", "scalable" — rewrite as specific, testable criteria, or remove.
- **Too many ACs.** If you're past ~7 bullets, the story is probably two stories.
- **Engineer Notes restating the AC.** If a note just repeats what's in the AC, drop it.
- **Engineer Notes encoding cross-story dependencies.** No "depends on story 5" / "blocks SF-42" / "do after auth". Those belong in Jira links, not in the story body.
- **Jira field noise.** No priority, story points, labels, epic links in the body unless the user asked for them.
