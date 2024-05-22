# VYOS

## Workflow : add-pr-labels.yml
- **Purpose**: This workflow is designed to add labels automatically to pull requests based on the configuration file.
   
- **Trigger**: The workflow can be called by other workflows.
   
- **Job**: The job add-pr-label checks out a repository containing _reusable actions_, and uses the ***actions/labeler*** action to label pull requests.
   
- **Permissions**: The workflow has read access to the repository contents and write access to pull requests.
   
- **Configuration**: The labeler action uses a configuration file located in a checked-out repository directory.


## Workflow : assign-author.yml
- **Purpose**: This workflow is designed automatically to assign the _**author**_ of a pull request (PR) as the _**assignee**_ of that PR.
  
- **Trigger**: The workflow can be called by other workflows.
   
- **Job**: The ***toshimaru/auto-author-assign@v1.6.2*** action automates the assignment of pull request _**authors**_ as the _**assignees**_ for their PRs.
   
- **Permissions**: The workflow has read access to the repository contents and write access to pull requests.

   
### Workflow : check-pr-merge-conflict.yml
  This workflow triggers whenever a pull request is synchronized. 
  It will checks if the pull request has merge conflicts and updates labels and comments accordingly.

### Workflow : check-pr-message.yml
  To trigger this workflow, you need to create a pull request that targets one of the specified branches (current, crux, equuleus).
  It automatically verifies whether the commit message and titles of pull requests (PRs) meet certain formatting rules  whenever a PR is made to the specified branches (current, crux, equuleus).

### Workflow : check-stale.yml
  This workflow is triggered, whenever a pull request is made targeting any of the specified branches: current, crux, equuleus, or sagitta and sets up a cron job that runs the workflow every day at midnight UTC.
  It marks issues as stale if there has been no activity for 90 days and pull requests as stale if there has been no activity for 30 days. 
  It adds a "state: stale" label and a predefined message to these stale issues and pull requests. However, it does not automatically close them. The issue will be reviewed by a maintainer and may be closed.
  Issues and pull requests with labels like "state: accepted" or "state: in-progress" are exempt from being marked as stale. 
  This helps maintainers manage and prioritize active and inactive issues and PR in the repository.

### Workflow : check-unused-imports.yml
  To trigger this workflow, you need to create a pull request that targets one of the specified branches (current, sagitta).
  It performs code analysis using Pylint to check for unused imports in Python files.
  If there are any unused imports detected, it will fail the workflow run, indicating that the pull request contains unused imports that need to be addressed before merging.

### Workflow : codeql-analysis.yml
  The workflow triggers on pushes to specific branches, pull requests to the current branch, and on a scheduled cron job.
  It is designed to analyze code using GitHub's CodeQL, a tool for identifying vulnerabilities and errors in codebases.

### Workflow : label-backport.yml
  This workflow is designed to listen for comments on issues or pull requests.
  If a comment contains the command "@mergifyio backport" (in any case variation[MERFIFYIO/Mergifyio]), it automatically assigns "backport" label to that issue or pull request.

### Workflow : lint-j2.yml
  To trigger this workflow, you need to create a pull request that targets one of the specified branches (current, crux, equuleus).
  J2Lint is a linter for Jinja2 templates.
  It runs the J2Lint tool to lint Jinja2 files located in the $GITHUB_WORKSPACE/data directory.
