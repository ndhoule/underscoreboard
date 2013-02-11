#!/bin/sh
#
# This script will set up a pre-commit hook that runs tests on your code via
# grunt before each commit and only permits the commit if all tests are passing.
# Override this behavior by giving git commit the -n flag.

pc_hook=.git/hooks/pre-commit

touch $pc_hook && chmod +x $pc_hook && cat > $pc_hook <<EOF
#!/bin/sh
#
# Runs grunt tests before a commit is permitted.

# CD into base directory and run pre-commit grunt job. If any tests fail, bail out.
spec_error_msg="\n--------------------\n\nA commit has been prevented because some Grunt spec jobs have failed.\nPlease fix any broken specs or improperly linted files and try your commit again.\n"

cd \$GIT_DIR && cd .. && grunt precommit || (echo \$spec_error_msg ; exit 1)
EOF
