# Repository:-  vyos-1x

## Workflow : 1
  ## add-pr-labels.yml
  To trigger this workflow, you need to create a pull request that targets one of the specified branches (current, crux, equuleus, or sagitta).
  When a pull request is made to the repository, the tool will check the base branch of the pull request.
  If the base branch matches one of the branches specified under a label, the corresponding label will be applied to the pull request automatically.

 ## Workflow : 2
  ## assign-author.yml
  This workflow is triggered when pull requests are opened, reopened, marked as ready for review, or locked. 
  Its purpose is to automatically assign the author of the pull request to the pull request itself.
  This helps in organizing and triaging pull requests.

 ## Workflow : 3
  ## check-pr-merge-conflict.yml
  This workflow triggers whenever a pull request is synchronized. 
  It will checks if the pull request has merge conflicts and updates labels and comments accordingly.

## Workflow : 4
  ## check-pr-message.yml
  To trigger this workflow, you need to create a pull request that targets one of the specified branches (current, crux, equuleus).
  It automatically verifies whether the commit message and titles of pull requests (PRs) meet certain formatting rules  whenever a PR is made to the specified branches (current, crux, equuleus).

## Workflow : 5
  ## check-stale.yml
  This workflow is triggered, whenever a pull request is made targeting any of the specified branches: current, crux, equuleus, or sagitta and sets up a cron job that runs the workflow every day at midnight UTC
  It marks issues as stale if there has been no activity for 90 days and pull requests as stale if there has been no activity for 30 days. 
  It adds a "state: stale" label and a predefined message to these stale issues and pull requests. However, it does not automatically close them. The issue will be reviewed by a maintainer and may be closed.
  Issues and pull requests with labels like "state: accepted" or "state: in-progress" are exempt from being marked as stale. 
  This helps maintainers manage and prioritize active and inactive items in the repository.

## Workflow : 6
  ## check-unused-imports.yml
  To trigger this workflow, you need to create a pull request that targets one of the specified branches (current, sagitta).
  It performs code analysis using Pylint to check for unused imports in Python files.
  If there are any unused imports detected.It will likely fail the workflow run, indicating that the pull request contains unused imports that need to be addressed before merging.

## Workflow : 8
  ## label-backport.yml
  This workflow is designed to listen for comments on issues or pull requests.
  If a comment contains the command "@mergifyio backport" (in any case variation), it automatically adds a "backport" label to that issue or pull request.

## Workflow : 9
  ## lint-j2.yml
  To trigger this workflow, you need to create a pull request that targets one of the specified branches (current, crux, equuleus).
  J2Lint is a linter for Jinja2 templates.
  It runs the J2Lint tool to lint Jinja2 files located in the $GITHUB_WORKSPACE/data directory.







