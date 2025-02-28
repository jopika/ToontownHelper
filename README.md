## Overview
This is a simple application that tracks Toontasks and lets you share a room with other players.  
This enables task sharing and coordination in real time.

## Installing
Go to https://github.com/jopika/ToontownHelper/releases and download the latest application for your computer.

## Contributing
You may open a PR with changes if you'd like, and either @jopika or @amyjzhu will review and approve it.


## Publishing a new version
Clients will automatically pull and retrieve new versions as they are published.

To bump the version:
- Run `npm version [level] -m [message]`
- Add changes to the commit as needed
- Merge changes into the main branch
- Go to https://github.com/jopika/ToontownHelper/actions/workflows/release.yml and trigger a run
- Once the builds are complete, release the new Github version by going to https://github.com/jopika/ToontownHelper/releases and publishing the draft.