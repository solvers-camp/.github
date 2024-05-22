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

   
## Workflow : check-pr-merge-conflict.yml
- **Purpose**: This action checks if the pull request can be merged _**cleanly**_ or if there are _**merge conflicts**_.
  
- **Trigger**: The workflow can be called by other workflows.
   
- **Job**: **eps1lon/actions-label-merge-conflict@v3**  — specifies the action to use.
    - **With:**
      - dirtyLabel: **"state: conflict"** — label to add if there are conflicts.
      - removeOnDirtyLabel: **"state: conflict resolved"** — label to remove when conflicts are resolved.
      - repoToken: "${{ secrets.GITHUB_TOKEN }}" — authentication token for the action.
      - commentOnDirty: **"This pull request has conflicts, please resolve those before we can evaluate the pull request."** — comment to post if there are
        conflicts.
      - commentOnClean: **"Conflicts have been resolved. A maintainer will review the pull request shortly."** — comment to post if conflicts are resolved.
   
- **Permissions**: The workflow has read access to the repository contents and write access to pull requests.


## Workflow : check-pr-message.yml
- **Purpose**: This workflow verifies whether the commit message and titles of pull requests meet certain formatting rules whenever a PR is made.
  
- **Trigger**: The workflow can be called by other workflows.
   
- **Job**: This runs a Python script located at **./reusable-actions/scripts/check-pr-title-and-commit-messages.py**. The script is passed the URL of the pull request as an argument. The URL is accessed using **${{ github.event.pull_request.url }}**, which is a GitHub Actions context expression that provides the URL of the pull request triggering the workflow.
   
- **Permissions**: The workflow has read access to the repository contents and write access to pull requests.

  
## Workflow : check-stale.yml
- **Purpose**: This action manages stale issues and pull requests by marking them with a label and optionally closing them after a period of inactivity.
  
- **Trigger**: The workflow can be called by other workflows.
   
- **Job**: **actions/stale@v6** — uses the stale action to manage stale issues and pull requests.
    - _repo-token_: ${{ secrets.GITHUB_TOKEN }} — authentication token for the action.
    - _days-before-stale_: **90** — days of inactivity before marking an issue as stale.
    - _days-before-close_: *-1* — prevents automatic closing of stale issues.
    - _stale-issue-message_ — message to post on stale issues.
    - _stale-issue-label_: '**state: stale**' — label to add to stale issues.
    - _exempt-issue-labels_: '**state: accepted, state: in-progress**' — labels that exempt issues from being marked as stale.
    - _stale-pr-message_ — message to post on stale pull requests.
    - _stale-pr-label_: '**state: stale**' — label to add to stale pull requests.
    - _exempt-pr-labels_: '**state: accepted, state: in-progress**' — labels that exempt pull requests from being marked as stale.
   
- **Permissions**: The workflow has read access to the repository contents and write access to pull requests.

## Workflow : check-unused-imports.yml
- **Purpose**: This workflow performs code analysis using Pylint to check for unused imports in Python files.
  
- **Trigger**: The workflow can be called by other workflows.
   
- **Job**: pylint to check for unused imports (W0611) in Python files and files in the src/migration-scripts directory.
     - pylint_files=$(git ls-files *.py src/migration-scripts): This command uses git ls-files to list all .py files and files in the src/migration-scripts directory, storing the result in the pylint_files variable.
     - pylint --disable=all --enable=W0611 $pylint_files: This command runs pylint on the files listed in pylint_files. The --disable=all option disables all checks, and --enable=W0611 enables only the check for unused imports (W0611).
   
- **Permissions**: The workflow has read access to the repository contents.


## Workflow : codeql-analysis.yml
- **Purpose**: This workflow analyze code using GitHub's CodeQL, a tool for identifying vulnerabilities and errors in codebases.
  
- **Trigger**: The workflow can be called by other workflows.
   
- **Job**:
    - **Input**
        - languages: Specifies the **languages** for CodeQL to analyze.
        - codeql-cfg-path: **Path** to a CodeQL configuration file, if provided.
        - build-command: **Manual** build command, if **provided**.

    - **Strategy**
        - fail-fast: false — ensures the workflow does not cancel all jobs if one fails.
        - matrix — runs the job for each specified language.

    - **Steps**
        - Checkout the Repository: Uses actions/checkout@v4 to check out the repository code.
        - Initialize CodeQL: Uses **_github/codeql-action/init@v3_** to initialize CodeQL with the specified languages and configuration file.
        - Autobuild: Uses **_github/codeql-action/autobuild@v3_** to automatically build the code if no build command is provided.
        - Manual Build: Executes the provided build command if specified.
        - Perform CodeQL Analysis: Uses **_github/codeql-action/analyze@v3_** to analyze the code for vulnerabilities, bugs, and other errors.
  
- **Permissions**:
    - _actions_: read — allows the workflow to read actions.
    - _contents_: read — allows the workflow to read the repository contents.
    - _security-events_: write — allows the workflow to write security events.
  
### Workflow : label-backport.yml
  This workflow is designed to listen for comments on issues or pull requests.
  If a comment contains the command "@mergifyio backport" (in any case variation[MERFIFYIO/Mergifyio]), it automatically assigns "backport" label to that issue or pull request.

### Workflow : lint-j2.yml
  To trigger this workflow, you need to create a pull request that targets one of the specified branches (current, crux, equuleus).
  J2Lint is a linter for Jinja2 templates.
  It runs the J2Lint tool to lint Jinja2 files located in the $GITHUB_WORKSPACE/data directory.
