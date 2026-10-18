---
name: security
description: Apply security best practices for passwords, credentials, database access, and data protection. Use when handling authentication, secrets management, or implementing security controls.
---

# Security Skill

## Passwords

- Hash all passwords
- Never store plaintext

## Credentials

- Store in secret manager
- Auto-rotation enabled
- Never commit to repository
- Never log credentials

## Database Access

- Database not publicly accessible
- Bastion host for access
- Encryption key in secret manager
- Connection retry logic

## Authentication

- Log auth successes
- Log auth failures
- Retry logic for auth operations

## Data Protection

- No PII in logs
- Audit table tracks all data changes
- Log data deletion events
- Log data downloads

## Infrastructure

- Blue/green deployment for database upgrades
- Encryption at rest
- Encryption in transit

## Logging

- All exceptions logged as ERROR
- No sensitive data in logs
- CloudWatch for centralized logging