#!/bin/bash
# refactor-check.sh — PostToolUse hook
# After Edit/Write on TS/JS production code, run ESLint with refactor-focused
# rules layered on top of the project config. Surface violations to Claude
# via hookSpecificOutput.additionalContext so the next turn must address them.
#
# Maps ESLint rules → Fowler smells from ~/.claude/REFACTORING.md:
#   complexity, max-depth           → Long Function (decomposition needed)
#   max-lines-per-function          → Long Function
#   max-params                      → Long Parameter List
#   no-param-reassign               → Mutable Data
#
# Thresholds override via env vars in settings.json:
#   CLAUDE_REFACTOR_COMPLEXITY   (default 10, McCabe)
#   CLAUDE_REFACTOR_MAX_LINES_FN (default 30)
#   CLAUDE_REFACTOR_MAX_PARAMS   (default 4)
#   CLAUDE_REFACTOR_MAX_DEPTH    (default 3)

set -eu
TOOL_INPUT="$(cat)"
FILE_PATH="$(printf '%s' "$TOOL_INPUT" | jq -r '.tool_input.file_path // empty')"

[ -z "$FILE_PATH" ] && exit 0
[ ! -f "$FILE_PATH" ] && exit 0

# Mirror tdd-check.sh allow list — don't check tests, configs, infra
case "$FILE_PATH" in
  *.test.ts|*.test.tsx|*.test.js|*.test.jsx) exit 0 ;;
  *.spec.ts|*.spec.tsx|*.spec.js|*.spec.jsx) exit 0 ;;
  */__tests__/*|*/e2e/*|*/drizzle/*|*/migrations/*|*/infrastructure/*) exit 0 ;;
  */db/schema.ts|*/db/seed.ts|*/db/run-seed.ts) exit 0 ;;
  *webpack.config*|*jest.config*|*drizzle.config*|*playwright.config*|*eslint.config*) exit 0 ;;
  */setupEnv.ts|*/setupTests.ts|*/shared/logger.ts) exit 0 ;;
esac

# Only check production TS/JS
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx) ;;
  *) exit 0 ;;
esac

# Find project root (closest package.json above the file).
# Guard on "." as well as "/": dirname "." returns "." forever, so a relative
# file_path would spin here until the hook timeout killed it.
DIR="$(dirname "$FILE_PATH")"
while [ "$DIR" != "/" ] && [ "$DIR" != "." ] && [ ! -f "$DIR/package.json" ]; do
  DIR="$(dirname "$DIR")"
done
[ -f "$DIR/package.json" ] || exit 0

# Require project-local ESLint — fail silently if absent
ESLINT_BIN="$DIR/node_modules/.bin/eslint"
[ -x "$ESLINT_BIN" ] || exit 0

# Thresholds
COMPLEXITY="${CLAUDE_REFACTOR_COMPLEXITY:-10}"
MAX_LINES_FN="${CLAUDE_REFACTOR_MAX_LINES_FN:-30}"
MAX_PARAMS="${CLAUDE_REFACTOR_MAX_PARAMS:-4}"
MAX_DEPTH="${CLAUDE_REFACTOR_MAX_DEPTH:-3}"

# Layer refactor rules on top of the project's existing ESLint config
VIOLATIONS="$(cd "$DIR" && "$ESLINT_BIN" \
  --rule "{\"complexity\": [\"error\", $COMPLEXITY]}" \
  --rule "{\"max-lines-per-function\": [\"error\", {\"max\": $MAX_LINES_FN, \"skipBlankLines\": true, \"skipComments\": true}]}" \
  --rule "{\"max-params\": [\"error\", $MAX_PARAMS]}" \
  --rule "{\"max-depth\": [\"error\", $MAX_DEPTH]}" \
  --rule '{"no-param-reassign": ["error"]}' \
  --format compact \
  "$FILE_PATH" 2>&1 || true)"

# If ESLint itself failed to run (bad config, missing plugin), don't block
if echo "$VIOLATIONS" | grep -qE '^Error: (Cannot|No ESLint|Configuration|Failed)'; then
  exit 0
fi

# Only report on the refactor-relevant rules we layered in
REFACTOR_HITS="$(echo "$VIOLATIONS" | grep -E '(complexity|max-lines-per-function|max-params|max-depth|no-param-reassign)\)\.?$' || true)"

[ -z "$REFACTOR_HITS" ] && exit 0

FILE_BASENAME="$(basename "$FILE_PATH")"
CONTEXT="REFACTOR SIGNAL — ESLint detected Fowler smell indicators in ${FILE_BASENAME}:

${REFACTOR_HITS}

Mapping to smells in ~/.claude/REFACTORING.md:
  complexity / max-depth  → Long Function; Extract Function, Decompose Conditional, Replace Nested Conditional with Guard Clauses
  max-lines-per-function  → Long Function; Extract Function
  max-params              → Long Parameter List; Introduce Parameter Object, Preserve Whole Object, Remove Flag Argument
  no-param-reassign       → Mutable Data; Split Variable, Extract Function, Separate Query from Modifier

Before your next tool call, either:
  (a) refactor to resolve these with tests green after each step, or
  (b) state clearly why a violation is justified here (e.g., 'this function mirrors a third-party API shape, refactoring it would not improve design').

Skipping refactor silently is a TDD violation, not a style preference. If this function is pre-existing and you only touched a small part of it, the Boy Scout Rule still applies — improve what you touched."

jq -n --arg ctx "$CONTEXT" '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: $ctx
  }
}'
exit 0
