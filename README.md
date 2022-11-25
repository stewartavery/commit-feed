# commit-feed

This project was created in response to a take home assignment from [Chronosphere](https://chronosphere.io/).

## How to Use

1. Follow the steps [here](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) to create a Github personal access token.
1. Create a `.env.local` file at the root of the repo.
1. Add `REACT_APP_GITHUB_API_TOKEN=` to the first line in the file and paste in your access token after the `=`.
1. Run `npm start` and check out `localhost:3000`.

If you want to run tests you can run `npm test`!

## More Info

Due to the time nature of this project it does not take responsiveness into account. You'll need a wide browser window to view the table
properly.

## Known Bugs

If you're using a vertical monitor the lazy loading pagination logic may not get called. Ensure that some amount of scroll bar is visible in order to paginate properly through the commit responses.
