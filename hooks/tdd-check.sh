#!/bin/bash
# TDD gate: block Edit/Write on production TS/JS files unless a recent
# failing-test signal is present in the current session transcript.
#
# When a RED signal is detected, the edit is allowed AND a refactor-phase
# reminder (Fowler, Refactoring 2nd ed.) is injected into the model's
# context via hookSpecificOutput.additionalContext.
#
# Exits:
#   0 → allow
#   2 → block (stderr shown to Claude)
set -eu
TOOL_INPUT="$(cat)"
TOOL_NAME="$(printf '%s' "$TOOL_INPUT" | jq -r '.tool_name // empty')"
FILE_PATH="$(printf '%s' "$TOOL_INPUT" | jq -r '.tool_input.file_path // .tool_input.notebook_path // empty')"
TRANSCRIPT_PATH="$(printf '%s' "$TOOL_INPUT" | jq -r '.transcript_path // empty')"

# Bash can write source files with a redirect or heredoc, which would route
# around a gate that only watches Edit/Write. Pull the redirect target out of
# the command so those writes are held to the same standard.
if [ "$TOOL_NAME" = "Bash" ]; then
  CMD="$(printf '%s' "$TOOL_INPUT" | jq -r '.tool_input.command // empty')"
  FILE_PATH="$(printf '%s' "$CMD" \
    | grep -oE '(>>?[[:space:]]*|\btee[[:space:]]+(-a[[:space:]]+)?)[^[:space:]|&;<>]+\.[jt]sx?\b' \
    | grep -oE '[^[:space:]|&;<>]+\.[jt]sx?$' \
    | head -1 || true)"
fi

# No file path? Nothing to check.
[ -z "$FILE_PATH" ] && exit 0

# ---- Always-allow list (matches CLAUDE.md TDD exceptions) ----
case "$FILE_PATH" in
  # Test files
  *.test.ts|*.test.tsx|*.test.js|*.test.jsx) exit 0 ;;
  *.spec.ts|*.spec.tsx|*.spec.js|*.spec.jsx) exit 0 ;;
  */__tests__/*|*/e2e/*)                     exit 0 ;;
  # Config / docs / infra
  *.md|*.json|*.yml|*.yaml|*.toml)           exit 0 ;;
  *.tf|*.hcl|*.tfvars)                       exit 0 ;;
  *.sql|*/drizzle/*|*/migrations/*)          exit 0 ;;
  */db/schema.ts|*/db/seed.ts|*/db/run-seed.ts) exit 0 ;;
  */infrastructure/*)                        exit 0 ;;
  *.env.example|*webpack.config*|*jest.config*|*drizzle.config*|*playwright.config*|*eslint.config*) exit 0 ;;
  *.html|*.css|*.scss)                       exit 0 ;;
  *.sh)                                      exit 0 ;;
  */setupEnv.ts|*/setupTests.ts)             exit 0 ;;
  # Logger infrastructure
  */shared/logger.ts)                        exit 0 ;;
  # Claude Code mods
  */.claude/dev-mods/*|*/.claude/mods/*)     exit 0 ;;
esac

# ---- Only enforce on TS/JS source ----
case "$FILE_PATH" in
  *.ts|*.tsx|*.js|*.jsx) ;;
  *) exit 0 ;;
esac

# ---- Check for bypass keywords in recent USER messages ----
# TDD does not apply to deletions/removals or pure-presentation work — there is
# no behavior to drive. When the user asks for one of those, let the edit through.
#
# IMPORTANT: only the user's own text is scanned, never the whole transcript.
# Scanning the raw transcript made this gate self-disabling: the refactor
# reminders these hooks inject contain "Dead Code" and "Remove Flag Argument",
# which matched the bypass patterns below and switched the gate off for the rest
# of the session after its very first fire.
if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
  USER_TEXT="$(tail -n 400 "$TRANSCRIPT_PATH" 2>/dev/null | jq -r '
      select(.type? == "user")
      | .message.content
      | if type == "string" then .
        elif type == "array" then (map(select(.type? == "text") | .text) | join("\n"))
        else empty end
    ' 2>/dev/null | grep -v '^<' || true)"

  # Anchored to imperative phrasing so narrative prose does not trip the gate.
  if [ -n "$USER_TEXT" ] && printf '%s' "$USER_TEXT" | grep -qiE \
    '(remove|delete|drop|strip|rip out|tear out|clean up) (the |this |that |a |an |any |all |existing |current |unused |dead )*(feature|flag|test|code|gate|wrapper|guard|toggle|dead code|diagnostic logging|debug logging)|feature[- ]flag removal|(css|styling|style|layout|visual|appearance|cosmetic|copy|wording|ui)[- ](only|change|tweak|polish|update)|pure(ly)? (css|styling|style)|look and feel|restyle|rename (the |this |that |a |an )?(button|label|field|column|heading|toggle|checkbox|switch)|change the (label|description|copy|wording|heading|placeholder|button text)'; then
    exit 0
  fi
fi

# ---- Locate transcript ----
if [ -n "$TRANSCRIPT_PATH" ] && [ -f "$TRANSCRIPT_PATH" ]; then
  LATEST="$TRANSCRIPT_PATH"
else
  CWD="$(pwd)"
  PROJECT_SLUG="$(printf '%s' "$CWD" | sed 's|/|-|g')"
  TRANSCRIPT_DIR="$HOME/.claude/projects/$PROJECT_SLUG"
  LATEST="$(ls -t "$TRANSCRIPT_DIR"/*.jsonl 2>/dev/null | head -1 || true)"
fi

# No transcript resolvable → fresh session, nothing to enforce against.
[ -z "$LATEST" ] && exit 0
[ -f "$LATEST" ] || exit 0

# ---- Look for a RED signal in the recent tail of the transcript ----
# Patterns are anchored to real test-runner output. Loose forms that used to
# live here — a bare "Cannot find module" and an unanchored "Expected.*Received"
# — matched ordinary discussion of tests and let edits through without a red bar.
if tail -c 300000 "$LATEST" | grep -qE \
  'FAIL +[^ ]+\.(test|spec)\.[tj]sx?|Tests:? +[0-9]+ failed|Test Suites:? +[0-9]+ failed|Test Files +[0-9]+ failed|[0-9]+ tests? failed|TS[0-9]+: .*(has no exported member|Cannot find module|Property .* does not exist)|● .* ✕|Expected: .*Received: |AssertionError' ; then

  # RED signal found → allow with refactor-phase reminder (Fowler 2nd ed.).
  # The additionalContext is injected into the model's context so Claude
  # sees it alongside the allowed tool call.
  cat <<'JSON'
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "allow",
    "additionalContext": "TDD gate passed — failing test detected. You are now in GREEN or REFACTOR phase.\n\nFOWLER'S TWO HATS (Refactoring 2nd ed.) — wear only one at a time:\n- GREEN hat: smallest code change to pass the failing test. No cleanup, no restructuring.\n- REFACTOR hat: tests stay green. No new behavior. Structure only.\n\nAFTER THIS EDIT MAKES TESTS GREEN, STOP. Before writing the next failing test, scan the code you just wrote AND the surrounding code you touched for these 22 smells:\n\nBloaters: Long Function, Long Parameter List, Large Class, Primitive Obsession, Data Clumps\nOO Abusers: Repeated Switches, Loops, Refused Bequest, Alternative Classes with Different Interfaces\nChange Preventers: Divergent Change, Shotgun Surgery\nDispensables: Duplicated Code, Lazy Element, Speculative Generality, Dead Code, Comments (masking bad code)\nCouplers: Feature Envy, Insider Trading, Message Chains, Middle Man\nOther: Mysterious Name, Mutable Data, Global Data, Temporary Field, Data Class\n\nIf a smell is present, apply the matching refactoring from ~/.claude/REFACTORING.md in SMALL STEPS. Run tests after each step. If tests go red, revert and take a smaller step. Commit after each named refactoring completes green.\n\nIf you notice a missing behavior while refactoring, DO NOT add it here. Note it and write a failing test for it next (Red phase again).\n\nRefactoring is not optional — it is the third step of TDD. Skipping it accumulates design debt."
  }
}
JSON
  exit 0
fi

cat >&2 <<'MSG_EOF'
BLOCK: TDD VIOLATION — No recent failing test detected in the session transcript.
Before editing production code:
  1. Write ONE failing test.
  2. Run it (e.g. `npx jest path/to/test.ts`) and confirm it fails for the right reason.
  3. Edit the production code to make it pass (GREEN).
  4. Refactor per Fowler's smell catalog — see ~/.claude/REFACTORING.md.
If you believe this is a false positive (config/infra/schema that should be on
the allow list, or a failing-test output pattern the grep missed), widen the
allow list or grep patterns in:
  ~/.claude/hooks/tdd-check.sh
Writing the file through Bash (redirect, heredoc, or tee) is also gated — it is
not a way around this.
MSG_EOF
exit 2
