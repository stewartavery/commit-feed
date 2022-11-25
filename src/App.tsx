import { useRef } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { GithubForm } from "./components/GithubForm";
import { GithubTable } from "./components/GithubTable";
import { NotFound } from "./components/NotFound";

function App() {
  // passed to InfiniteScroller component for fetchNext pagination control
  const scrollRef = useRef(null);
  return (
    <BrowserRouter>
      <div ref={scrollRef} className="App">
        <div className="App-container">
          <header>
            <h1>Commit Feed</h1>
          </header>
          <Routes>
            <Route path="/" element={<GithubForm />} />
            <Route
              path="/:author/:repo"
              element={<GithubTable scrollRef={scrollRef} />}
            />
            <Route path="/does/not/exist" element={<NotFound />}></Route>
            <Route path="*" element={<Navigate to="/does/not/exist" />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
