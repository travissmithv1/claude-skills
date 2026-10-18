# Claude Skills

Shareable [Claude Code skills](https://docs.claude.com/en/docs/claude-code/skills), mods, and hooks.

- [Skills](#books--principles)
- [Mods](#mods)
- [Hooks](#hooks)

## Books & Principles

| Skill | Description |
|-------|-------------|
| [accelerate](skills/accelerate/SKILL.md) | DORA / *Accelerate* delivery-performance metrics and capabilities |
| [advanced-refactoring](skills/advanced-refactoring/SKILL.md) | Kerievsky's *Refactoring to Patterns* |
| [clean-architecture](skills/clean-architecture/SKILL.md) | Robert C. Martin's *Clean Architecture* |
| [clean-code](skills/clean-code/SKILL.md) | Robert C. Martin's *Clean Code* |
| [design-patterns](skills/design-patterns/SKILL.md) | The Gang of Four design patterns |
| [implementation-patterns](skills/implementation-patterns/SKILL.md) | Kent Beck's *Implementation Patterns* |
| [legacy-code](skills/legacy-code/SKILL.md) | Feathers' *Working Effectively with Legacy Code* |
| [poeaa](skills/poeaa/SKILL.md) | Fowler's *Patterns of Enterprise Application Architecture* |
| [pragmatic-programmer](skills/pragmatic-programmer/SKILL.md) | Hunt & Thomas's *The Pragmatic Programmer* |
| [refactoring](skills/refactoring/SKILL.md) | Fowler's *Refactoring* (2nd Edition) catalog |
| [tdd](skills/tdd/SKILL.md) | Kent Beck's *Test-Driven Development By Example* |
| [xunit-test-patterns](skills/xunit-test-patterns/SKILL.md) | Meszaros's *xUnit Test Patterns* |

## Engineering Practices

| Skill | Description |
|-------|-------------|
| [automated-testing](skills/automated-testing/SKILL.md) | Testing pyramid, unit/integration/acceptance test guidelines |
| [cleanup](skills/cleanup/SKILL.md) | Remove empty files, folders, and unused code |
| [database](skills/database/SKILL.md) | Migrations, connections, auditing, and local database setup |
| [devtools](skills/devtools/SKILL.md) | Local-only dev tools panel on the login screen |
| [feature-flags](skills/feature-flags/SKILL.md) | Feature flag implementation, testing, and cleanup |
| [git-workflow](skills/git-workflow/SKILL.md) | Commit, message, and review conventions |
| [logging](skills/logging/SKILL.md) | Log levels, audit trails, and CloudWatch |
| [remember-your-training](skills/remember-your-training/SKILL.md) | Session defaults for version control, verification, and testing |
| [security](skills/security/SKILL.md) | Passwords, credentials, and data protection |
| [source-control-ready](skills/source-control-ready/SKILL.md) | Check for sensitive files, create `.env.example` and `.claudeignore` |

## Project Setup & Infrastructure

| Skill | Description |
|-------|-------------|
| [github-actions-cicd](skills/github-actions-cicd/SKILL.md) | GitHub Actions build/test/deploy pipelines to AWS via OIDC |
| [github-actions-pipeline](skills/github-actions-pipeline/SKILL.md) | Build/test/deploy workflow adapted to api, web, and mobile directories |
| [project-structure](skills/project-structure/SKILL.md) | Monorepo layout, tech stack, and local development conventions |
| [readme-updater](skills/readme-updater/SKILL.md) | Minimal root and per-app READMEs |
| [shell-scripts](skills/shell-scripts/SKILL.md) | `run_api.sh`, `run_tests.sh`, and other local helper scripts |
| [terraform-aws-infrastructure](skills/terraform-aws-infrastructure/SKILL.md) | AWS infrastructure with modular Terraform, Terraform Cloud workspaces, and OIDC auth |

## Planning & Documents

| Skill | Description |
|-------|-------------|
| [project-plan](skills/project-plan/SKILL.md) | Application specs with personas, features, workflows, and costs (.docx) |
| [statement-of-work](skills/statement-of-work/SKILL.md) | Client-ready SOW documents (.docx) |
| [technical-estimate](skills/technical-estimate/SKILL.md) | Architecture, effort, cost, and risk estimates (.docx) |
| [user-stories](skills/user-stories/SKILL.md) | Thin-sliced, persona-driven user stories for Jira |

## Installation

Copy a skill folder into your personal skills directory (available in all projects):

```bash
cp -r skills/terraform-aws-infrastructure ~/.claude/skills/
```

Or into a project's `.claude/skills/` directory to share it with that project's collaborators.

Invoke a skill with `/<skill-name>` (e.g. `/tdd`), or let Claude pick it up automatically when the task matches.

## Mods

Changes to Claude Code's own interface and behavior, each a small plugin with a `register` hooks module and tests.

| Mod | Description |
|-----|-------------|
| [context-meter](mods/context-meter) | Context-window usage and token count in the status line |
| [git-branch-band](mods/git-branch-band) | Current git branch, uncommitted changes, and ahead/behind counts above the prompt |
| [secret-scrubber](mods/secret-scrubber) | Redacts secrets and API keys from tool output before Claude sees it |
| [soft-clear](mods/soft-clear) | Makes `/clear` clear the screen while keeping the session (`/clear reset` starts a new one) |
| [usage-meter](mods/usage-meter) | 5-hour and weekly rate-limit usage under the prompt |

### Installation

Copy a mod into `~/.claude/mods/` and add its path to `CLAUDE_CODE_PLUGIN_DIRS` in `~/.claude/settings.json` (colon-separated):

```json
{
  "env": {
    "CLAUDE_CODE_PLUGIN_DIRS": "~/.claude/mods/context-meter:~/.claude/mods/git-branch-band"
  }
}
```

Type definitions under `.claude-plugin/types/` are generated by Claude Code and are not checked in.

## Hooks

| Hook | Event | Description |
|------|-------|-------------|
| [tdd-check.sh](hooks/tdd-check.sh) | `PreToolUse` | Blocks edits to production TS/JS unless a failing test appears in the session transcript |
| [refactor-check.sh](hooks/refactor-check.sh) | `PostToolUse` | Runs ESLint with refactoring-focused rules and reports Fowler smell indicators |
| [REFACTORING.md](hooks/REFACTORING.md) | — | Smell → refactoring reference both hooks point Claude to |

Both hooks require `jq`; `refactor-check.sh` uses the project's local ESLint and skips silently if it is absent.

### Installation

```bash
cp hooks/tdd-check.sh hooks/refactor-check.sh ~/.claude/hooks/
cp hooks/REFACTORING.md ~/.claude/
```

Then register them in `~/.claude/settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|NotebookEdit|Bash",
        "hooks": [{ "type": "command", "command": "$HOME/.claude/hooks/tdd-check.sh" }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [{ "type": "command", "command": "$HOME/.claude/hooks/refactor-check.sh" }]
      }
    ]
  }
}
```
