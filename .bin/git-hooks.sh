#!/usr/bin/env sh

#
# This script sets up a pre-commit hook that runs a Grunt task (named
# `precommit`) before each commit and will prevent the commit unless the task
# returns with an exit code of 0 (successful). Override this behavior by passing
# `git commit` the -n flag.
#

PC_HOOK=.git/hooks/pre-commit

touch $PC_HOOK && chmod +x $PC_HOOK && cat > $PC_HOOK <<EOF
#!/bin/sh
#
# Runs grunt tests before a commit is permitted.

# CD into base directory and run pre-commit grunt job. If any tests fail, bail out.
spec_error_msg="\n--------------------\n\nA commit has been prevented because some Grunt spec jobs have failed.\nPlease fix any broken specs or improperly linted files and try your commit again.\n"

cd \$GIT_DIR && cd .. && grunt precommit || (echo \$spec_error_msg ; exit 1)
EOF
