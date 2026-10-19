---
name: commit-message
description: Write a single-line git commit message (imperative, sentence case, no prefix, no trailing period, under 72 characters). Use when asked for a commit message, commit subject, or "what should I call this commit", or when about to commit. Output is one line in a code block, ready to paste; never runs git commit.
---

# Commit Message

Produce exactly one line, in a fenced code block, that the user can paste into
`git commit -m`. Do not commit, stage, or push; the user handles git.

## Gather the change first

Derive the message from the actual diff, never from the branch name or the
ticket title alone. In order of preference:

1. Staged changes: `git diff --cached --stat` and `git diff --cached`.
2. If nothing is staged, the working tree: `git diff --stat` and `git diff`.
3. If both are empty, the commits on this branch not on main:
   `git log main..HEAD --format=%s`, plus `git diff main...HEAD --stat`.

Also run `git log --format=%s -15` so the line matches the tone of recent
history. If the diff is large, read the stat and skim the files that carry
the behavior change rather than every hunk.

## Format

- One line. No body, no trailer, no footer, no attribution.
- Imperative mood, as if completing "This change will ...": `Retry`, `Fix`,
  `Add`, `Don't`, `Handle`, `Allow`.
- Sentence case: capital first letter, everything else lowercase except
  proper nouns and product names (Stripe, Postgres, GitHub, Sentry,
  Admin, Lambda).
- No trailing period. No conventional-commit prefix such as `feat:` or
  `fix(api):`. No ticket ID, PR number, or emoji. GitHub appends the PR
  number on squash.
- Aim for 50 characters, hard stop at 72. If it cannot fit, the commit is
  probably doing two things; say so in one sentence outside the code block
  and offer a line for the primary change.

## Content

- Lead with the user-visible or operational effect, then the condition or
  cause if there is room: `Retry Stripe calls on 504s`, `Don't block uploads
  based on a damaged duplicate`, `Handle stale callbacks in login`.
- Say why or what behavior changed, not which files moved. Never list
  files, functions, or packages unless the name is the clearest way to say
  what changed (`Add file search in admin`).
- Prefer the specific verb over a vague one. `Fix`, `Update`, `Improve`, and
  `Changes` are acceptable only when the diff really is a grab bag; then
  name the area (`Dashboard display fixes`, `Perf fixes`).
- Contractions like `Don't` are fine and match history.
- Never mention AI, Claude, or that the message was generated.

## Output

Reply with the single line in a code block and nothing else, unless the diff
is empty or spans unrelated changes. In those cases add one short sentence
before the block explaining the assumption or the split.

```
Retry Stripe calls on 504s
```
