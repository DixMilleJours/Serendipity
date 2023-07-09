# Description
1. https://firebase.google.com/docs/functions/get-started?gen=1st
Follow the link above to learn about how to deploy a function to Cloud Functions.
2. https://youtu.be/gA6WGYQWrKc
Follw the link above to learn about how to set-up Cloud Functions environment and test functions locally BEFORE deploying to Cloud Functions.

# Must-Do
- ! Download packages: MUST go to `functions` folder
`npm install`
`npm install -g firebase-tools`

- Follow step 2 in `Description` to learn about how to test functions with the emulator
`npm run serve` should start the emulator. If the cloud function is correct, it will give you a link.

- Call that link from the front-end (E.g. using axios) to test functions locally. Please refer to the `handleClick` function in `Searchbar.jsx` file within the `dashboard` folder.

- After your local testing is complete, before doing cloud deployment, DELETE the `package-lock.json` file (if exists) located under `functions` folder.

- Important: When ready to deploy to Cloud Functions, please only deploy the changed function:
`firebase deploy functions:yourFunction`

- If it gives you a link, but this time in the format of https://us-central1-serendipity-e1c63.cloudfunctions.net/,
you've successfully deployed the function to the cloud.

# index.js
- All functions to be deployed are here.
- ! DO NOT change the current way of importing packages. Please use `require`, NOT `import`.
- Notice how cors wraps your function body.
- Notice when sending back the final response
`res.set('Access-Control-Allow-Origin', '*');` is a MUST.
