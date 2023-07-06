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
`npm run serve` should start the emulator. If the cloud function is correct, it will give you a link. Call that link from the front-end (E.g. using axios) to test functions locally.
- When ready to deploy to Cloud Functions
`firebase deploy --only functions`

# index.js
- All functions to be deployed are here.
- ! DO NOT change the current way of importing packages.
- Notice how cors wraps your function body.
- Notice when sending back the final response
`res.set('Access-Control-Allow-Origin', '*');` is a MUST.