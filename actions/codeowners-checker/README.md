## dist/index.js
- **Purpose**: The script ensures that specified repositories within an organization have a CODEOWNERS file.If a repository does not already have a CODEOWNERS file, the script creates a new branch, adds the CODEOWNERS file, and then opens a pull request to merge these changes. It uses a configuration file to determine which repositories to include or exclude from this operation.

- **package.json**: The package.json includes the dependencies for _**@actions/core and @actions/github**_.

- **Setup and Authentication**:
     - The script retrieves a GitHub token for authentication.
     - It sets up an Octokit instance (GitHub API client) using this token.
     - It identifies the organization and the source repository from the workflow inputs.

- **Process**:
     - _**fetchContent**_: Reads the content of the CODEOWNERS file and the configuration file from the local directory.
     - _**checkExistingPulls**_: Checks if there are any existing pull requests with the same branch name for the repository.
     - _**getDefaultBranch**_: Retrieves the default branch name of a repository.
     - _**createNewBranch**_: Creates a new branch from the default branch.
     - _**createFileInBranch**_: Adds the CODEOWNERS file to the new branch.
     - _**createPullRequest**_: Opens a pull request to merge the new branch into the default branch.
     - **Main Logic**:
         - Reads the CODEOWNERS file and configuration settings.
         - Lists all repositories in the organization.
         - For each repository in the include list and not in the exclude list:
             - Checks if the repository already has a CODEOWNERS file.
             - If not, it creates a branch, adds the CODEOWNERS file, and opens a pull request.

## action.yml
- **Purpose**: This action takes a GitHub token and the name of a source repository as inputs. It runs a Node.js script (index.js) to check for the presence of CODEOWNERS files in specified repositories.

- **Inputs**:
     - _**github-token**_: This is the token used to authenticate with the GitHub API.
         - required: true
     - _**source-repo**_: This is the repository where the source CODEOWNERS file is located.
         - required: true

- **Runs**:
     - _**using: 'node12'**_: Specifies that this action runs using Node.js version 12.
     - _**main: 'index.js'**_: Indicates that the main script file for this action is index.js.
