import * as core from '@actions/core';
import * as github from '@actions/github';

interface Repo {
  name: string;
}

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('github-token', { required: true });
    const octokit = github.getOctokit(token);
    const org: string = github.context.repo.owner;
    const sourceRepo: string = github.context.repo.repo;

    async function checkExistingPulls(repo: Repo, branchName: string): Promise<boolean> {
      const existingPulls = await octokit.rest.pulls.list({
        owner: org,
        repo: repo.name,
        head: `${org}:${branchName}`
      });
      return existingPulls.data.length > 0;
    }

    async function getDefaultBranch(repo: Repo): Promise<string> {
      const { data: { default_branch } } = await octokit.rest.repos.get({
        owner: org,
        repo: repo.name,
      });
      return default_branch;
    }

    async function createNewBranch(repo: Repo, default_branch: string, branchName: string): Promise<void> {
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

    async function createPullRequest(repo: Repo, branchName: string, default_branch: string): Promise<void> {
      await octokit.rest.pulls.create({
        owner: org,
        repo: repo.name,
        title: `Add CODEOWNERS file to ${repo.name}`,
        head: branchName,
        base: default_branch,
      });
    }

    async function createBranchAndPR(repo: Repo): Promise<void> {
      const branchName = `codeowners-feature-${repo.name}`;

      if (await checkExistingPulls(repo, branchName)) {
        console.log(`Pull request already exists for repository ${repo.name}`);
        return;
      }

      const default_branch = await getDefaultBranch(repo);

      await createNewBranch(repo, default_branch, branchName);
      await createPullRequest(repo, branchName, default_branch);
    }

    const repo: Repo = { name: sourceRepo };

    try {
      await octokit.rest.repos.getContent({
        owner: org,
        repo: repo.name,
        path: 'CODEOWNERS',
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message.includes('Not Found')) {
        await createBranchAndPR(repo);
      }
    }

  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred.');
    }
  }
}

run();