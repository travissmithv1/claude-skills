---
name: cleanup
description: Clean up empty files, folders, and unused code. Use when refactoring, after deleting features, or improving codebase hygiene.
allowed-tools: Read, Grep, Glob, Bash, Task, Edit
---

# Codebase Cleanup

Review this codebase and clean up any empty files, folders, or unused code.

## Target Directory

Work on: $ARGUMENTS

If no directory specified, analyze the current working directory.

## What to Find and Remove

### 1. Empty Directories
Find and remove directories with no files (excluding node_modules, .git, and other ignored directories).

### 2. Empty Files
Find files with no content or only whitespace.

### 3. Unused Code Patterns
- **Unused imports** - imports that are never referenced
- **Unused exports** - exports from index files that don't exist or aren't used
- **Orphaned files** - files that define code (controllers, services, use cases) that are never wired into the application
- **Dead code paths** - functions, classes, or variables that are defined but never called/used
- **Commented-out code blocks** - large sections of commented code (not documentation comments)

### 4. Orphaned Infrastructure
- Repository implementations without corresponding interface usage
- Service implementations that aren't registered in DI containers
- Route files that aren't mounted in the application
- Test artifact directories (empty trace folders, etc.)

## Process

1. **Explore first**: Use the Explore agent to thoroughly scan the codebase for issues
2. **Verify findings**: Confirm that identified code is truly unused by checking for imports/references
3. **Ask before major deletions**: If significant code (multiple files, entire features) will be removed, ask for confirmation
4. **Clean up incrementally**:
   - Remove empty directories
   - Remove orphaned files
   - Update index/export files to remove references to deleted files
   - Fix any imports that referenced deleted code
5. **Run linting**: After cleanup, run the project's linter to catch any issues caused by the changes
6. **Fix lint errors**: Resolve any lint errors introduced by the cleanup (unused imports, etc.)

## Safety Rules

- Never delete files that are imported or referenced elsewhere without updating those references
- Never delete test files that contain actual tests
- Never delete configuration files (.env, tsconfig, etc.) without explicit confirmation
- Preserve database migrations even if they seem unused
- Keep entity/model files if they're used by repositories or migrations

## Output

Provide a summary of what was removed:
- Number of empty directories removed
- Number of empty/orphaned files removed
- Any code patterns that were cleaned up
- Lint errors that were fixed
