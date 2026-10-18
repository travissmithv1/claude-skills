---
name: git-workflow
description: Follow git workflow best practices for commits, messages, and code review. Use when committing code, writing commit messages, or managing version control operations.
---

# Git Workflow Skill

## Commit Frequency

- Small, frequent commits
- Commit often as long as all tests pass
- Only related changes per commit
- Few files per commit for easy review

## Commit Messages

- One line only
- Explain why, not what
- Never indicate AI-generated commits

## Pre-Commit Requirements

- All tests must pass
- Tests automatically run before each commit
- Never use --no-verify

## Boundaries

- Never auto-push commits
- Never create commits automatically without explicit user direction
- Always ask for permission before committing or pushing changes
- Human reviews code before committing
- Human handles all git operations

## Unrelated Issues

- Document unrelated issues instead of fixing immediately
- Keep commits focused on single purpose
- Separate concerns into separate commits

## Code Conventions

- Follow tech stack code conventions
- Match existing file formatting exactly
- Ask for clarification rather than assume