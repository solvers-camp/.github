# VYOS

## Workflow : add-pr-labels.yml
- **Purpose**: This workflow is designed to add labels automatically to pull requests based on the configuration file.
   
- **Trigger**: on pull_request_target
   
- **Job**: The job add-pr-label checks out a repository containing _reusable actions_, and uses the ***actions/labeler*** action to label pull requests.
   
- **Permissions**: The workflow has read access to the repository contents and write access to pull requests.
   
- **Configuration**: The labeler action uses a configuration file located in a checked-out repository directory.


## Workflow : assign-author.yml
- **Purpose**: This workflow is designed automatically to assign the _**author**_ of a pull request (PR) as the _**assignee**_ of that PR.
  
- **Trigger**: on pull_request_target types: [opened, reopened, ready_for_review, locked]
   
- **Job**: The ***toshimaru/auto-author-assign@v1.6.2*** action automates the assignment of pull request _**authors**_ as the _**assignees**_ for their PRs.
   
- **Permissions**: The workflow has read access to the repository contents and write access to pull requests.

   
## Workflow : check-pr-merge-conflict.yml
- **Purpose**: This action checks if the pull request can be merged _**cleanly**_ or if there are _**merge conflicts**_.
  
- **Trigger**: on pull_request_target [types:synchronize]
   
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
  
- **Trigger**: on pull_request
   
- **Job**: This runs a Python script located at **./reusable-actions/scripts/check-pr-title-and-commit-messages.py**. The script is passed the URL of the pull request as an argument. The URL is accessed using **${{ github.event.pull_request.url }}**, which is a GitHub Actions context expression that provides the URL of the pull request triggering the workflow.
   
- **Permissions**: The workflow has read access to the repository contents and write access to pull requests.

  
## Workflow : check-stale.yml
- **Purpose**: This action manages stale issues and pull requests by marking them with a label and optionally closing them after a period of inactivity.
  
- **Trigger**: on schedule 
   
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
  
- **Trigger**: on on pull_request, workflow_dispatch
   
- **Job**: pylint to check for unused imports (W0611) in Python files and files in the src/migration-scripts directory.
     - pylint_files=$(git ls-files *.py src/migration-scripts): This command uses git ls-files to list all .py files and files in the src/migration-scripts directory, storing the result in the pylint_files variable.
     - pylint --disable=all --enable=W0611 $pylint_files: This command runs pylint on the files listed in pylint_files. The --disable=all option disables all checks, and --enable=W0611 enables only the check for unused imports (W0611).
   
- **Permissions**: The workflow has read access to the repository contents.


## Workflow : codeql-analysis.yml
- **Purpose**: This workflow analyze code using GitHub's CodeQL, a tool for identifying vulnerabilities and errors in codebases.
  
- **Trigger**: on pull_request, push, schedule
   
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
  
## Workflow : label-backport.yml
- **Purpose**: This workflow is designed to listen for comments on issues or pull requests. If comments found label updated as 'backport'.
  
- **Trigger**: on issue_comment
  
- **Job**:
     - The actions **ecosystem/action-regex-match@v2** used to perform a regular expression match.
         - **with**: Defines the inputs for the action.
              - text: ${{ github.event.comment.body }}: Specifies the text to match against, which in this case is the body of the GitHub event comment.
              - regex: '@[Mm][Ee][Rr][Gg][Ii][Ff][Yy][Ii][Oo] backport' The regular expression pattern to match. It looks for the text **_@mergifyio backport_** in a case-insensitive manner.

     - The actions **ecosystem/action-add-labels@v1** used to add labels to the pull request.
          - ${{ steps.regex-match.outputs.match != '' }} This condition checks if the previous regex match step was successful. It only runs this step if a match was found.
              - **with**: Defines the inputs for the action.
                   - labels: **_backport_**: Specifies the label to be added to the pull request. In this case, it adds the backport label.


- **Permissions**: The workflow has read access to the repository contents and write access to pull requests.

## Workflow : lint-j2.yml
- **Purpose**: This workflow is designed to validate Jinja2 (J2) template files using J2 lint tool
  
- **Trigger**: on pull_request, workflow_dispatch
   
- **Job**:
    - sudo pip install **git+https://github.com/aristanetworks/j2lint.git@341b5d5db86e095b622f09770cb6367a1583620e** Installs the **j2lint tool** from a specific commit of its GitHub repository using pip with sudo to ensure necessary permissions

    - j2lint **$GITHUB_WORKSPACE/data** Runs the j2lint tool on the data directory within the checked-out repository.

- **Permissions**: The workflow has read access to the repository contents and write access to pull requests.

## Workflow : check-create-pr-CODEOWNERS.yml
- **Purpose**: This workflow automates the maintenance of the CODEOWNERS file across the organization's repositories. By running daily and allowing manual triggers, it ensures the CODEOWNERS file is up-to-date, reflecting current repository access and code review responsibilities.
  
- **Trigger**: on schedule and manually triggered
  
- **Job**:
     - The **actions/checkout@v2** action is used to check out the .github repository from the organization.
         - **with**: Defines the inputs for the action.
              - repository: ${{ github.repository_owner }}/.github: Specifies the repository to check out. ${{ github.repository_owner }} dynamically gets the owner of the current repository and targets the .github repository.
              - token: ${{ secrets.GITHUB_TOKEN }}: Uses a GitHub token stored in secrets to authenticate the checkout process.
  
     - The **tibdex/github-app-token@v1** action is used to generate a GitHub App token for further actions.
          - **id**: 'generate_token': Assigns an ID to this step for referencing its outputs in subsequent steps.
          - **with**: Defines the inputs for the action.
              - app_id: ${{ secrets.APP_ID }}: Uses the GitHub App ID stored in secrets to identify the app.
              - private_key: ${{ secrets.PRIVATE_KEY }}: Uses the private key stored in secrets to authenticate and generate the token.
  
     - The **solvers-camp/CODEOWNERS-checker/action@main** action is used to check the CODEOWNERS file and perform necessary updates.
         - **with**: Defines the inputs for the action.
              - github-token: ${{ steps.generate_token.outputs.token }}: Uses the GitHub App token generated in the previous step to authenticate the action.
              - source-repo: .github: Specifies the source repository for the CODEOWNERS file.
  
- **Permissions**: The workflow uses read access to the repository contents and write access to pull requests.

## .github : codeowners_repos_config.json
- **Purpose**: This configuration specifies which repositories to include and exclude for certain operations, ensuring targeted and efficient processing based on predefined criteria.
   
- **Include**: The repositories listed under "include" are the ones that will be processed or targeted by the workflow or script.
   
- **Exclude**: The repositories listed under "exclude" are the ones that will be ignored or skipped by the workflow or script.

