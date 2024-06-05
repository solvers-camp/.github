const core = require('@actions/core');
const github = require('@actions/github');
const fs = require('fs');

async function run() {
  try {
    const token = core.getInput('github-token', { required: true });
    const octokit = github.getOctokit(token);
    const org = github.context.repo.owner;
    const sourceRepo = core.getInput('source-repo', { required: true });

    async function fetchContent(path) {
        try {
          const content = fs.readFileSync(path, 'utf8');
          return content;
        } catch (error) {
          console.log(`Cannot find ${path} in ${sourceRepo}`);
          return null;
        }
    }

    async function checkExistingPulls(repo, branchName) {
        const existingPulls = await octokit.rest.pulls.list({
          owner: org,
          repo: repo.name,
          head: `${org}:${branchName}`
        });
        return existingPulls.data.length > 0;
    }

    async function getDefaultBranch(repo) {
        const { data: { default_branch } } = await octokit.rest.repos.get({
          owner: org,
          repo: repo.name,
        });
        return default_branch;
    }

    async function createNewBranch(repo, default_branch, branchName) {
        const { data: ref } = await octokit.rest.git.getRef({
          owner: org,
          repo: repo.name,
          ref: `heads/${default_branch}`,
        });

        await octokit.rest.git.createRef({
          owner: org,
          repo: repo.name,
          ref: `refs/heads/${branchName}`,
          sha: ref.object.sha,
        });
    }

    async function createFileInBranch(repo, decodedContent, branchName) {
        await octokit.rest.repos.createOrUpdateFileContents({
          owner: org,
          repo: repo.name,
          path: 'CODEOWNERS',
          message: 'Created CODEOWNERS',
          content: Buffer.from(decodedContent).toString('base64'),
          branch: branchName,
        });
    }

    async function createPullRequest(repo, branchName, default_branch) {
        await octokit.rest.pulls.create({
          owner: org,
          repo: repo.name,
          title: `Add CODEOWNERS file to ${repo.name}`,
          head: branchName,
          base: default_branch,
        });
    }

    async function createBranchAndPR(repo, sourceContent) {
        const branchName = `codeowners-feature-${repo.name}`;

        if (await checkExistingPulls(repo, branchName)) {
          console.log(`Pull request already exists for repository ${repo.name}`);
          return;
        }

        const default_branch = await getDefaultBranch(repo);

        await createNewBranch(repo, default_branch, branchName);
        await createFileInBranch(repo, sourceContent, branchName);
        await createPullRequest(repo, branchName, default_branch);
    }

    const sourceContent = await fetchContent('CODEOWNERS');
    const settingsContent = await fetchContent('.github/codeowners-settings.yml');

    if (!sourceContent || !settingsContent) {
        return;
    }

    const settings = JSON.parse(settingsContent);

    const repos = await octokit.paginate(octokit.rest.repos.listForOrg, {
        org,
        type: 'all',
    });

    for (const repo of repos) {
        if (repo.name !== sourceRepo && settings.include.includes(repo.name) && !settings.exclude.includes(repo.name)) {
          try {
            await octokit.rest.repos.getContent({
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