# Prerequisites

Before running the workflow, you need to create a GitHub App and install it in your organization. Follow these steps:

## Create a GitHub App

1. Go to GitHub and sign in.
2. Navigate to Settings > Developer settings > GitHub Apps.
3. Click on "New GitHub App".
4. Fill in the necessary details like App name, Homepage URL, etc.
5. Set the "Webhook" section to "Active" and provide a URL. If you don't have a URL, you can use a placeholder like `https://example.com`.
6. In the "Permissions" section, set the permissions your app needs.
7. In the "Where can this GitHub App be installed?" section, choose "Any account".
8. Click on "Create GitHub App".

## Generate a Private Key

1. In your app's settings, go to the "General" section.
2. Click on "Generate a private key" and download the generated `.pem` file.
3. Open the `.pem` file in a text editor and copy its content.

## Install the App in the Organization

1. Go to the "Install App" section in your app's settings.
2. Click on "Install" next to the organization where you want to install the app.

## Get the App ID

1. In your app's settings, go to the "General" section.
2. You'll find the App ID there.

## Store the App ID and Private Key in Secrets

1. Go to the organization/repository where you have the workflow.
2. Navigate to Settings > Secrets.
3. Click on "New repository secret".
4. Create a new secret named `CODEOWNERS_APP_ID` and paste the App ID as its value.
5. Create another secret named `CODEOWNERS_PRIVATE_KEY` and paste the content of the `.pem` file as its value.

# Using tibdex/github-app-token

The `tibdex/github-app-token@v1` action is used in the workflow to generate a GitHub App token. This token is used to authenticate the workflow and perform actions with the permissions granted to the GitHub App.

The action requires two inputs: `app_id` and `private_key`. These are provided through the `CODEOWNERS_APP_ID` and `CODEOWNERS_PRIVATE_KEY` secrets respectively.

Once the prerequisites are met, you can run the workflow in your machine. The workflow will use the GitHub App to generate a token and use it to check-create-pr-codeowners.

# actions/codeowners-checker

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
