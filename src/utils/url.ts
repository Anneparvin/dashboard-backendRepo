// src/utils/url.ts
const ALLOWED_REPO_HOSTS = ["github.com", "gitlab.com", "bitbucket.org"];

const cleanHost = (hostname: string) => hostname.replace(/^www\./, "").toLowerCase();

export function isValidRepoUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const segments = url.pathname.split("/").filter(Boolean);
    return (
      url.protocol === "https:" &&
      ALLOWED_REPO_HOSTS.includes(cleanHost(url.hostname)) &&
      segments.length >= 2 // owner/repo দুটোই থাকতে হবে
    );
  } catch {
    return false;
  }
}

// https://www.GitHub.com/Ali/App.git/ → https://github.com/ali/app
export function normalizeRepoUrl(value: string): string {
  const url = new URL(value);
  const [owner, repo] = url.pathname.split("/").filter(Boolean);
  const cleanRepo = repo.replace(/\.git$/i, "");
  return `https://${cleanHost(url.hostname)}/${owner}/${cleanRepo}`.toLowerCase();
}