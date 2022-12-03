import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";

const headerLink =
  '<https://api.github.com/repositories/61153677/commits?page=2>; rel="next", <https://api.github.com/repositories/61153677/commits?page=141>; rel="last"';

function getPrimaryCommits() {
  return Array.from({ length: 30 }, (_, index) => ({
    commit: {
      sha: `commit-${index}`,
      message: `drawing rectangle - ${index}`,
      author: { date: "2022-11-04T22:08:22Z", name: "Foo" },
    },
  }));
}

function getSecondaryCommits() {
  return Array.from({ length: 30 }, (_, index) => ({
    commit: {
      sha: `commit-${index + 30}`,
      message: `drawing square - ${index}`,
      author: { date: "2022-11-04T22:08:22Z", name: "Bar" },
    },
  }));
}

describe("Integration tests for commit-feed", () => {
  beforeEach(() => {
    // @ts-ignore
    global.fetch = jest.fn(() =>
      Promise.resolve({
        // @ts-ignore
        headers: {
          get: jest.fn(() => ""),
        },
        json: () => {
          return Promise.resolve([]);
        },
      })
    );
  });

  test("handles missing author field", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("heading", { name: "Commit Feed" })
    ).toBeInTheDocument();

    // focus should already be on first element
    userEvent.keyboard("twitter");

    userEvent.click(
      screen.getByRole("button", { name: "View the Commit Log" })
    );

    expect(
      screen.getByText("Make sure to fill in both fields!")
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Repository")).toHaveFocus();
  });
  test("handles missing repo field", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    userEvent.tab();
    userEvent.keyboard("twemoji");

    userEvent.click(
      screen.getByRole("button", { name: "View the Commit Log" })
    );

    expect(
      screen.getByText("Make sure to fill in both fields!")
    ).toBeInTheDocument();

    expect(screen.getByLabelText("Github Author")).toHaveFocus();
  });

  test("handles github repo not found", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        // @ts-ignore
        headers: {
          get: jest.fn(() => ""),
        },
        json: () => {
          return Promise.resolve({
            documentation_url: "some_url",
            message: "not found",
          });
        },
      })
    );

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    userEvent.keyboard("twitter");
    userEvent.tab();
    userEvent.keyboard("twemoji");

    userEvent.click(
      screen.getByRole("button", { name: "View the Commit Log" })
    );

    // will fail since we haven't mocked fetch yet
    const notFoundText = await screen.findByText("Github Commits not found!");
    expect(notFoundText).toBeInTheDocument();
  });

  test("handles loading github repo", async () => {
    // @ts-ignore
    global.fetch = jest.fn((url: string) =>
      Promise.resolve({
        // @ts-ignore
        headers: {
          get: jest.fn(() => headerLink),
        },
        json: () => {
          if (url.includes("page=1")) {
            return Promise.resolve(getPrimaryCommits());
          }
          // Note: I tried to get pagination to work, but couldn't
          // get scroll events to cooperate
          return Promise.resolve(getSecondaryCommits());
        },
      })
    );
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    userEvent.keyboard("twitter");
    userEvent.tab();
    userEvent.keyboard("twemoji");

    userEvent.click(
      screen.getByRole("button", { name: "View the Commit Log" })
    );

    const tableCaption = await screen.findByText("twitter / twemoji");
    expect(tableCaption).toBeInTheDocument();

    expect(
      screen.getByRole("cell", { name: "drawing rectangle - 0" })
    ).toBeInTheDocument();
  });

  test("handles incorrect route", async () => {
    render(
      <MemoryRouter initialEntries={["/some/random/route"]}>
        <App />
      </MemoryRouter>
    );

    const notFoundText = await screen.findByText("This page does not exist!");
    expect(notFoundText).toBeInTheDocument();
  });
});
