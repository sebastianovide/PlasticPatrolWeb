# plastic-patrol

This app is built based on [Geovation Photos](https://github.com/Geovation/photos) stack.

# Testing

To test, run `npm test`. This covers both the main app and our Firebase cloud functions.
To start up Jest in watch mode, run `npm run app:test:watch` and it will monitor your files
for changes and report if any tests break as a result.

# Functions

## Local Execution

To run functions locally, follow the instructions [here](https://firebase.google.com/docs/functions/local-emulator) to set up
the firebase emulator. When you make changes to the typescript, you will need to manually run `npm run build` in the functions/
directory to have those changes picked up by the emulator. Once that is running, you should be able to run:

```
curl http://localhost:5001/plastic-patrol-dev-722eb/us-central1/computeStats
```

And see the result.

## Unit Tests

To unit test functions in isolation, run `npm run functions:test`

# Travis
After changing any secret file:
```
cd cordova-app
tar cvf secrets.tar build.json *.cer *.p12 *.mobileprovision *.keystore
travis encrypt-file secrets.tar secrets.tar.enc -p -r Geovation/plastic-patrol
```
