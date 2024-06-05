
const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
  try {
    const token = core.getInput('github-token', { required: true });
    const octokit = github.getOctokit(token);
    const org = github.context.repo.owner;
    const sourceRepo = core.getInput('source-repo', { required: true });

    /**
    * Fetches and decodes the content of a file from the source repository.
    * @param {string} path - The path of the file in the repository.
    * @return {string} The decoded content of the file.
    */
    async function fetchContent(path) {
        try {
          const content = fs.readFileSync(path, 'utf8');
          return content;
        } catch (error) {
          console.log(`Cannot find ${path} in ${sourceRepo}`);
          return null;
        }
    }

    /**
    * Checks if a pull request already exists for a given repository and branch.
    * @param {Object} repo - The repository object.
    * @param {string} branchName - The name of the branch.
    * @return {boolean} True if a pull request exists, false otherwise.
    */
    async function checkExistingPulls(repo, branchName) {
        const existingPulls = await github.pulls.list({
          owner: org,
          repo: repo.name,
          head: `${org}:${branchName}`
        });
        return existingPulls.data.length > 0;
    }

    /**
    * Fetches the default branch of a repository.
    * @param {Object} repo - The repository object.
    * @return {string} The name of the default branch.
    */
    async function getDefaultBranch(repo) {
        const { data: { default_branch } } = await github.repos.get({
          owner: org,
          repo: repo.name,
        });
        return default_branch;
    }

    /**
    * Creates a new branch in a repository.
    * @param {Object} repo - The repository object.
    * @param {string} default_branch - The name of the default branch.
    * @param {string} branchName - The name of the new branch.
    */
    async function createNewBranch(repo, default_branch, branchName) {
        const { data: ref } = await github.git.getRef({
          owner: org,
          repo: repo.name,
          ref: `heads/${default_branch}`,
        });

        await github.git.createRef({
          owner: org,
          repo: repo.name,
          ref: `refs/heads/${branchName}`,
          sha: ref.object.sha,
        });
    }

    /**
    * Creates a new file in a branch.
    * @param {Object} repo - The repository object.
    * @param {string} decodedContent - The content to be written to the file.
    * @param {string} branchName - The name of the branch.
    */
    async function createFileInBranch(repo, decodedContent, branchName) {
        await github.repos.createOrUpdateFileContents({
          owner: org,
          repo: repo.name,
          path: 'CODEOWNERS',
          message: 'Created CODEOWNERS',
          content: Buffer.from(decodedContent).toString('base64'),
          branch: branchName,
        });
    }

    /**
    * Creates a pull request.
    * @param {Object} repo - The repository object.
    * @param {string} branchName - The name of the branch.
    * @param {string} default_branch - The name of the default branch.
    */
    async function createPullRequest(repo, branchName, default_branch) {
        await github.pulls.create({
          owner: org,
          repo: repo.name,
          title: `Add CODEOWNERS file to ${repo.name}`,
          head: branchName,
          base: default_branch,
        });
    }

    /**
    * Creates a new branch, adds a CODEOWNERS file to it, and creates a pull request.
    * @param {Object} repo - The repository object.
    * @param {string} decodedContent - The content to be written to the CODEOWNERS file.
    */
    async function createBranchAndPR(repo, decodedContent) {
        const branchName = `codeowners-feature-${repo.name}`;

        if (await checkExistingPulls(repo, branchName)) {
          console.log(`Pull request already exists for repository ${repo.name}`);
          return;
        }

        const default_branch = await getDefaultBranch(repo);

        await createNewBranch(repo, default_branch, branchName);
        await createFileInBranch(repo, decodedContent, branchName);
        await createPullRequest(repo, branchName, default_branch);
    }

    const sourceContent = await fetchContent('CODEOWNERS');
    const settingsContent = await fetchContent('.github/codeowners-settings.yml');

        if (!sourceContent || !settingsContent) {
            return;
        }

    const settings = JSON.parse(settingsContent);

    const repos = await octokit.paginate(octokit.repos.listForOrg, {
        org,
        type: 'all',
    });

    for (const repo of repos) {
        if (repo.name !== sourceRepo && settings.include.includes(repo.name) && !settings.exclude.includes(repo.name)) {
          try {
            await github.repos.getContent({
              owner: org,
              repo: repo.name,
              path: 'CODEOWNERS',
            });
          } catch (error) {
            if (error.message.includes('Not Found')) {
              await createBranchAndPR(repo, sourceContent);
            }
          }
        }
    }        

 } catch (error) {
    core.setFailed(error.message);
   }
}

run();         