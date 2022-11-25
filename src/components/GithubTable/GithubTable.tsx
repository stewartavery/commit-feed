import { InfiniteScroller } from "../InfiniteScroller";
import { GithubTableRow } from "./GithubTableRow";
import { GithubCommit, useGithubCommits } from "./useGithubCommits";
import "./GithubTable.css";
import { Link, Navigate, useParams } from "react-router-dom";

function tableRenderer(commit: GithubCommit) {
  return <GithubTableRow key={commit.sha} commit={commit} />;
}

interface Props {
  readonly scrollRef: React.MutableRefObject<HTMLDivElement | null>;
}

export function GithubTable({ scrollRef }: Props) {
  const { author = "", repo = "" } = useParams<{
    author: string;
    repo: string;
  }>();

  const { commits, fetchNext } = useGithubCommits({
    author,
    repo,
  });

  if (commits.length === 0) {
    return <div role="progressbar">Loading...</div>;
  }

  if (!author || !repo) {
    return <Navigate to="/does/not/exist" />;
  }

  return (
    <>
      <Link to="/">Go Home</Link>
      <table>
        <caption>
          <strong>{`${author} / ${repo}`}</strong>
        </caption>
        <thead>
          <tr>
            <th className="dimension-header">Date</th>
            <th className="dimension-header">Message</th>
            <th className="dimension-header">Author</th>
          </tr>
        </thead>
        <tbody>
          <InfiniteScroller
            scrollRef={scrollRef}
            items={commits}
            renderer={tableRenderer}
            fetchNext={fetchNext}
          />
        </tbody>
      </table>
    </>
  );
}
