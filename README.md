# Claude Skills

Shareable [Claude Code skills](https://docs.claude.com/en/docs/claude-code/skills).

| Skill | Description |
|-------|-------------|
| [terraform-aws-infrastructure](skills/terraform-aws-infrastructure/SKILL.md) | AWS infrastructure with modular Terraform, Terraform Cloud workspaces, and OIDC auth |
| [github-actions-cicd](skills/github-actions-cicd/SKILL.md) | GitHub Actions build/test/deploy pipelines to AWS via OIDC |

## Installation

Copy a skill folder into your personal skills directory (available in all projects):

```bash
cp -r skills/terraform-aws-infrastructure ~/.claude/skills/
```

Or into a project's `.claude/skills/` directory to share it with that project's collaborators.

Invoke it with `/terraform-aws-infrastructure` or `/github-actions-cicd`, or let Claude pick it up automatically when the task matches.
