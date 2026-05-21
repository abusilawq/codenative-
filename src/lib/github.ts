import { Octokit } from "octokit";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export interface RepoFile {
  path: string;
  type: "file" | "dir";
  size: number;
}

export function parseRepoUrl(url: string): { owner: string; repo: string } | null {
  try {
    const u = url.trim().replace(/\.git$/, "");
    const match = u.match(/(?:github\.com[/:])?([\w.-]+)\/([\w.-]+?)(?:\/|$)/);
    if (!match) return null;
    return { owner: match[1], repo: match[2] };
  } catch {
    return null;
  }
}

export async function fetchRepoTree(owner: string, repo: string): Promise<{
  name: string;
  description: string | null;
  stars: number;
  defaultBranch: string;
  files: RepoFile[];
}> {
  const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
  const branch = repoData.default_branch;

  const { data: branchData } = await octokit.rest.repos.getBranch({ owner, repo, branch });
  const sha = branchData.commit.sha;

  const { data: tree } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: sha,
    recursive: "true",
  });

  const files: RepoFile[] = tree.tree
    .filter((node) => node.path && (node.type === "blob" || node.type === "tree"))
    .slice(0, 200) // cap for AI cost control
    .map((node) => ({
      path: node.path!,
      type: node.type === "blob" ? "file" : "dir",
      size: node.size ?? 0,
    }));

  return {
    name: `${owner}/${repo}`,
    description: repoData.description,
    stars: repoData.stargazers_count,
    defaultBranch: branch,
    files,
  };
}

export function formatTreeForPrompt(files: RepoFile[]): string {
  return files
    .map((f) => `${f.type === "dir" ? "📁" : "📄"} ${f.path}${f.size ? ` (${f.size}b)` : ""}`)
    .join("\n");
}
