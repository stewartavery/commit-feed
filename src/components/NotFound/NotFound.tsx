import { Link, useSearchParams } from "react-router-dom";

export function NotFound() {
  const [searchParams] = useSearchParams();
  return (
    <>
      {searchParams.get("isInvalidRepo") === "true" ? (
        <span>Github Commits not found!</span>
      ) : (
        <span>This page does not exist!</span>
      )}
      <Link to="/">Go Back</Link>
    </>
  );
}
