import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import "./GithubForm.css";

export function GithubForm() {
  const navigate = useNavigate();
  const [author, setAuthor] = useState("");
  const [repo, setRepo] = useState("");
  const [error, setError] = useState("");

  const authorRef = useRef<HTMLInputElement>(null);
  const repoRef = useRef<HTMLInputElement>(null);

  const handleAuthorInputChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setAuthor(e.currentTarget.value);
    },
    []
  );

  const handleRepoInputChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setRepo(e.currentTarget.value);
    },
    []
  );

  const handleFormSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!author || !repo) {
        // TODO: re-validate on blur
        setError("Make sure to fill in both fields!");

        /**
         * the order is important — if both are missing
         * we want to assign focus to the first element
         */
        if (!author && authorRef.current) {
          authorRef.current.focus();
          return;
        }

        if (!repo && repoRef.current) {
          repoRef.current.focus();
          return;
        }

        return;
      }

      navigate(`/${author}/${repo}`);
    },
    [author, navigate, repo]
  );

  // assign focus to first input on mount
  useEffect(() => {
    if (authorRef.current) {
      authorRef.current.focus();
    }
  }, []);

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="form-container">
        <div className="form-row">
          <label className="form-label" htmlFor="author">
            Github Author
          </label>
          <div className="form-input">
            <input
              id="author"
              value={author}
              onChange={handleAuthorInputChange}
              ref={authorRef}
            />
          </div>
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="repository">
            Repository
          </label>
          <div className="form-input">
            <input
              id="repository"
              value={repo}
              onChange={handleRepoInputChange}
              ref={repoRef}
            />
          </div>
        </div>
        {error ? <span className="form-error">{error}</span> : null}
        <button type="submit" className="form-button">
          View the Commit Log
        </button>
      </div>
    </form>
  );
}
