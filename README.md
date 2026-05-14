## Overview
This is a simple application that tracks Toontasks and lets you share a room with other players.  
This enables task sharing and coordination in real time.

## Installing
Go to https://github.com/jopika/ToontownHelper/releases and download the latest application for your computer.

## Contributing
You may open a PR with changes if you'd like, and either @jopika or @amyjzhu will review and approve it.

## Testing
Install dependencies with `npm ci`, then run:

- `npm test` to run the regression suite once.
- `npm run test:watch` while developing.
- `npm run test:coverage` to generate a local coverage report.

Tests and testing dependencies are development-only. They must not be imported by production code or bundled into release executables.

## Publishing a new version
Clients will automatically pull and retrieve new versions as they are published.

To bump the version:
- Run `npm version [level] -m [message]`
  - [level] is one of `major | minor | patch | premajor | preminor | prepatch | prerelease`
- Add changes to the commit as needed
- Merge changes into the main branch
- Go to https://github.com/jopika/ToontownHelper/actions/workflows/release.yml and trigger a run
- The release workflow runs tests, packages the app, and verifies that no test-only files or packages are present in the packaged output before publishing.
- Once the builds are complete, release the new Github version by going to https://github.com/jopika/ToontownHelper/releases and publishing the draft.
