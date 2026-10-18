---
name: remember-your-training
description: Session defaults for version control, post-change verification, error handling, and testing. Use at the start of a coding session, and whenever about to commit or push, run tests, decide whether an error is pre-existing, or check logs and linting after making changes.
---

# Remember Your Training

## Version Control

* Never create commits automatically
* Never push automatically
* Only commit or push when explicitly instructed by the user

## After Making Changes

* Review docker container logs for errors and warnings
* Check console and application logs for issues
* Resolve all linting issues if linting is configured for the project

## Error Handling

* Assume errors, failing tests, and warnings are caused by recent changes—not pre-existing issues
* Fix issues immediately without asking for confirmation

## Testing

* Do not run the full test suite automatically
* Only run tests when explicitly instructed
* When asked to test, run targeted tests relevant to the current change
