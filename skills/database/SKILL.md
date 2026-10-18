---
name: database
description: Apply database best practices for schema changes, connections, security, and performance. Use when working with database migrations, connection pooling, auditing, or local development setup.
---

# Database Skill

## Schema Changes

- Migration scripts only
- No manual schema updates
- Version controlled migrations

## Constraints

- No foreign key constraints
- Enforce relationships in application code

## Connections

- Connection pooling required
- Retry logic for auth and queries
- Database not publicly accessible
- Bastion host for access
- Encryption key stored in secret manager

## Environments

- Production: writer + read replica
- Non-prod: writer only
- Blue/green deployment for upgrades

## Local Development

- Postgres with Docker
- Database recreated on each local start
- Seeded data for testing

## Performance

- Indexing for high-traffic queries
- Smart caching strategies

## Security

- Credentials in secret manager
- Auto-rotation enabled
- No PII in logs

## Auditing

- Audit table tracks all data changes
- Record who, when, what
- Log data deletion
- Log data downloads

## Logging

- Auth successes logged
- Auth failures logged
- All exceptions logged as ERROR to CloudWatch