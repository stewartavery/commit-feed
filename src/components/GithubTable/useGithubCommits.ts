import { useCallback, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { fetchGithubCommits } from "../../api";

interface CommitAuthor {
  readonly name: string;
  readonly email: string;
  readonly date: string;
}

interface Commit {
  readonly url: string;
  readonly author: CommitAuthor;
  readonly committer: CommitAuthor;
  readonly message: string;
}

export interface GithubCommit {
  readonly sha: string;
  readonly commit: Commit;
  readonly html_url: string;
}

interface NotFound {
  readonly documentation_url: string;
  readonly message: string;
}

interface UseGithubCommitsOutput {
  readonly commits: GithubCommit[];
  readonly fetchNext: () => void;
}

interface RepoMap {
  readonly [key: string]: GithubCommit[];
}

interface NextPageMap {
  readonly [key: string]: number | null;
}

interface UseGithubCommitsInput {
  readonly author: string;
  readonly repo: string;
}

/**
 * A custom hook for fetching commits using the Github API.
 *
 * It stores a map of commits for each "repoKey" (which is a hash of the "author" + "repo").
 *
 * The logic fetches an initial request then parses the response to determine if there are
 * subsequent pages. If there _are_ subsequent pages the custom hook stores the next URL (which includes
 * the page query parameter id).
 *
 * When a consumer invokes the `fetchNext` callback, the custom hook can then use that value to fetch
 * the next page and concatenate the results onto the previous set.
 *
 * @param UseGithubCommitsInput
 * @returns UseGithubCommitsOutput
 */
export function useGithubCommits({
  author,
  repo,
}: UseGithubCommitsInput): UseGithubCommitsOutput {
  const repoKey = `${author}-${repo}`;

  const [commitMap, setCommitMap] = useState<RepoMap>({});
  const [nextPageMap, setNextPageMap] = useState<NextPageMap>({});
  const navigate = useNavigate();

  const isFetching = useRef(false);

  const fetchData = useCallback(
    async (author: string, repo: string, page?: number) => {
      isFetching.current = true;

      try {
        const response = await fetchGithubCommits(author, repo, page);

        const data: GithubCommit[] | NotFound = await response.json();

        // documentation_url appears when repo is not found.
        // if this is the case, we need to redirect user
        if ("documentation_url" in data) {
          navigate("/does/not/exist?isInvalidRepo=true");
          return;
        }

        const link: null | string = response.headers.get("link");

        if (link) {
          const links = link.split(",");
          const urls = links.map((a) => {
            return {
              url: a.split(";")[0].substring(1, a.split(";")[0].length - 1),
              title: a.split(";")[1],
            };
          });

          if (urls[0].title.includes("next")) {
            const nextUrl = urls[0].url.split("page=");
            const pageNumber = Number(nextUrl[1]);

            if (!isNaN(pageNumber)) {
              setNextPageMap((prevMap) => ({
                ...prevMap,
                [repoKey]: pageNumber,
              }));
            }
          } else {
            setNextPageMap((prevMap) => ({
              ...prevMap,
              [repoKey]: null,
            }));
          }
        }

        setCommitMap((prevMap) => {
          const previousCommits = prevMap[repoKey] || [];

          return {
            ...prevMap,
            [repoKey]: [...previousCommits, ...data],
          };
        });
        isFetching.current = false;
      } catch (error) {
        console.error("failed to fetch", error);
        navigate("/does/not/exist?isInvalidRepo=true");
      }
    },
    [navigate, repoKey]
  );

  const fetchNext = useCallback(() => {
    const nextPage = nextPageMap[repoKey];
    if (nextPage && !isFetching.current) {
      fetchData(author, repo, nextPage);
    }
  }, [nextPageMap, repoKey, fetchData, author, repo]);

  useEffect(() => {
    // Logic to ensure that this only happens once per author-repo combo
    if (!commitMap[repoKey] || commitMap[repoKey].length === 0) {
      fetchData(author, repo);
    }
  }, [author, commitMap, fetchData, repo, repoKey]);

  const commits = repoKey in commitMap ? commitMap[repoKey] : [];

  return { commits, fetchNext };
}
