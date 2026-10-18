#!/bin/bash

set -e # Exit immediately if a command exits with a non-zero status

STEP_DIVIDER="***********************************************"

# Run linter
. run_linter.sh

# Run unit tests
. run_unit_tests.sh

# Run end-to-end tests
. run_e2e_tests.sh

echo "$STEP_DIVIDER"
if [ $? -eq 0 ]; then
  echo "🎉 All tests passed! 🎉"
  echo "🚀 Code is ready for takeoff! 🚀"
  echo ""
else
  echo "💥 Test Failures! 💥"
  echo "⛔ Takeoff denied! ⛔"
fi
