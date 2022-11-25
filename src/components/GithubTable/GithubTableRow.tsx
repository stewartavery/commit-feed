import { GithubCommit } from "./useGithubCommits";

interface Props {
  readonly commit: GithubCommit;
}

export function GithubTableRow({ commit }: Props): JSX.Element {
  const localDate = new Date(commit.commit.author.date).toLocaleString();
  return (
    <tr>
      <td className="date-cell">{localDate}</td>
      <td className="message-cell">
        <div className="message-link no-overflow-cell">
          <a
            href={commit.html_url}
            title={commit.commit.message}
            target="_blank"
            rel="noreferrer"
          >
            {commit.commit.message}
          </a>
        </div>
      </td>
      <td className="author-cell">
        <div className="no-overflow-cell" title={commit.commit.author.name}>
          {commit.commit.author.name}
        </div>
      </td>
    </tr>
  );
}
