# plastic-patrol

_NOTE_ I highly recommend running "echo REACT_APP_USE_PROD_DATA=false >> .env" before running the app.

To start the webapp, just `npm start`

# Testing

To test, run `npm test`. This covers both the main app and our Firebase cloud functions.
To start up Jest in watch mode, run `npm run app:test:watch` and it will monitor your files
for changes and report if any tests break as a result.

# Functions

## Local Execution

To run functions locally, follow the instructions [here](https://firebase.google.com/docs/functions/local-emulator) to set up
the firebase emulator. You will need to set up credentials and `export GOOGLE_APPLICATION_CREDENTIALS` before running the emulator
(probably also add it to your .bashrc).

_NOTE_ These should be **dev** credentials!!

When you make changes to the typescript, you will need to manually `npm run build` in the functions/
directory to have those changes picked up by the emulator. Once that is up, you should be able to:

```
curl http://localhost:5001/plastic-patrol-dev-722eb/us-central1/computeStats
```

And see the result.

## Unit Tests

To unit test functions in isolation, run `npm run functions:test`

# Scripts

## firebase.js

```
node scripts/firebase.js
```

This is an example script demonstrating how to interact with firebase via node. It pulls in config.json from the main app so will respect
`REACT_APP_USE_PROD_DATA` as well.

## stats.js

Currently just fetches up-to-date stats for staging. Note that this bypasses the cache and is recomputed each time you run it, so don't run
it against production data.

# Travis

After changing any secret file:

```
cd cordova-app
tar cvf secrets.tar build.json *.cer *.p12 *.mobileprovision *.keystore
travis encrypt-file secrets.tar secrets.tar.enc -p -r Geovation/plastic-patrol
```

# Releases

CI manages the release of dev versions of the app to https://plastic-patrol-dev-722eb.web.app/#/
When creating a PR there's no need to bump package.json as that happens during the build process where we'll then tag the new version we deploy to dev.
Exact details on version bumping can be found [here](https://github.com/phips28/gh-action-bump-version)
If you want to bump a major vesion include "major" or "BREAKING CHANGE" in a commit message
Minor version include the string "feat" or "minor"
Anything else will be a patch version
