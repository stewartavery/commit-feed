export function fetchGithubCommits(
  author: string,
  repo: string,
  page: number = 1
) {
  const parameters = new URLSearchParams({
    page: page.toString(),
  });

  return fetch(
    `https://api.github.com/repos/${author}/${repo}/commits?${parameters.toString()}`,
    {
      headers: {
        authorization: `token ${process.env.REACT_APP_GITHUB_API_TOKEN}`,
      },
    }
  );
}
