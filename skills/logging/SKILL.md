---
name: logging
description: Apply logging best practices for log levels, audit trails, and CloudWatch integration. Use when implementing logging, setting up audit tracking, or configuring log destinations.
---

# Logging Skill

## Log Levels

- ERROR: All exceptions
- WARNING: Potential issues
- INFO: Significant events
- DEBUG: Diagnostic information
- TRACE: Detailed execution flow

## What to Log

- Auth successes
- Auth failures
- Data deletion
- Data downloads
- All exceptions as ERROR

## What Not to Log

- PII (personally identifiable information)
- Passwords or credentials
- Sensitive user data

## Destination

- CloudWatch for all logs
- Structured format for queryability

## Audit Trail

- Separate audit table for data changes
- Track who made the change
- Track when the change occurred
- Track what was changed

## Testing

- Do not write tests for logging
- Logging is infrastructure concern

## Format

- Consistent structure across application
- Include timestamp
- Include correlation ID for request tracing
- Include relevant context without sensitive data