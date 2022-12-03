# commit-feed

This project was created in response to a take home assignment from [Chronosphere](https://chronosphere.io/).

## How to Use

1. Follow the steps [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to create a Github personal access token.
1. Create a `.env.local` file at the root of the repo.
1. Add `REACT_APP_GITHUB_API_TOKEN=` to the first line in the file and paste in your access token after the `=`.
1. Run `npm install`
1. Run `npm start` and check out `localhost:3000`.

If you want to run tests you can run `npm test`!

## More Info

Due to the limited time nature of this project it does not take responsiveness into account. You'll need a wide browser window to view the table
properly.

## Known Issues/Quirks

- If you're using a vertical monitor the lazy loading pagination logic may not get called. Ensure that some amount of scroll bar is visible in order to paginate properly through the commit responses.

- When you run tests you'll see a warning like this associated with `InfiniteScroller.tsx` : `"Warning: Each child in a list should have a unique "key" prop."` My hunch is that there's some static analysis going on during jest runtime that doesn't understand that I'm passing a key in the `renderer`.

- We redirect to the `/does/not/exist` route if the request fails to fetch. Ideally this should probably show an error on the same route and give the user opportunity to retry the request.

- I used a map for the commit entries to allow support for back/forward navigation. However this state is wiped out if the user navigates back to home. A future optimization could be to store it at a higher level in the tree.

- This was my first time using the latest version of React Router and I noticed there were some nice API's around data loaders. A future optimization could be to integrate with this API to reduce waterfalls.
