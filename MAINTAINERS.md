# Maintainers Guide

This document is for maintainers and frequent contributors to ToontownHelper. It records the expected development, validation, commit, and release practices for the repository.

## Project Overview

ToontownHelper is an Electron Forge desktop app using Vite, React, TypeScript, and styled-components. The renderer reads local Toontown Companion App data from ports `1547` through `1552`, optionally syncs toon task metadata through the Task Hub service, and displays task information for the local and room toons.

Important areas:

- `src/main.ts`: Electron main process, BrowserWindow setup, auto-update wiring, and development DevTools behavior.
- `src/renderer.ts`: renderer entry point loaded by Vite.
- `src/mount.tsx`, `src/App.tsx`, `src/ToonLayout.tsx`, `src/TaskBox.tsx`: React UI composition.
- `src/hooks/useToonData.ts`: polling and room synchronization state.
- `src/adapters/ToontownConnector.ts`: local Companion App fetches.
- `src/adapters/TaskHubConnector.ts`: remote Task Hub API calls.
- `src/utils/TaskParser.ts`: task text and progress normalization.
- `forge.config.ts`: packaging, makers, fuses, and GitHub publisher setup.
- `.github/workflows/release.yml`: manually dispatched cross-platform publish workflow.

## Local Development

Use Node 20 for parity with the GitHub release workflow.

```sh
npm ci
npm start
```

`npm start` runs `electron-forge start`. In development mode the app opens Chromium DevTools from `src/main.ts`.

For local Toontown data testing:

1. Start Toontown.
2. Enable Companion App Support in Toontown options.
3. Accept the local helper connection prompt.
4. Confirm the app can display one or more local toons.
5. If testing room sync, enter a shared session ID and confirm another client in the same room can appear.

Use `.env.sample` as the shape for local environment variables. Do not commit `.env` or secrets.

## Validation

Run the narrowest relevant checks while developing, then run the full maintainer checklist before merging or releasing.

Current commands:

```sh
npm test
npm run test:coverage
npm run lint
npm run package
npm run verify:release-artifacts
```

`npm test` runs the Vitest regression suite for parser logic, connectors, hook behavior, and React render states. `npm run test:watch` is available for local development. Tests mock network and Electron-facing boundaries, so they should not require Toontown, Task Hub, or a real Electron process.

`npm run package` builds the Vite bundles and packages the app for the current platform under `out/`. Electron Forge may need network access while preparing Electron packaging assets.

`npm run verify:release-artifacts` scans packaged output and fails if test files, fixtures, coverage output, Vitest config, or testing-library packages are present. Tests and test-only dependencies must remain development-only and must never be imported by runtime code.

Known validation caveat: the repository currently has `.eslintrc.json`, but the installed ESLint major version is `9.x`, which expects `eslint.config.js`, `eslint.config.mjs`, or `eslint.config.cjs` by default. Until the config is migrated or the lint command is adjusted, `npm run lint` fails before source files are linted.

Manual smoke checks before release:

- App launches from `npm start`.
- App launches from the packaged output created by `npm run package`.
- Empty state appears when no Toontown client is available.
- Local toon data appears after Companion App Support is enabled and accepted.
- Multiple local toons are sorted consistently by toon ID.
- Session ID join flow updates room data without duplicating local toons.
- Version footer shows the package version from `package.json`.
- Auto-update behavior is not regressed by packaging or Forge publisher changes.

When adding tests, put them under `tests/` and use the existing fixture builders in `tests/fixtures.ts` so scenarios stay small and easy to review.

## Commit Naming and Structure

Use short, imperative commit subjects. Prefer Conventional Commit-style prefixes so release notes and history are easy to scan:

- `feat: add room refresh indicator`
- `fix: handle missing task progress`
- `chore: bump package versions`
- `docs: add maintainer release checklist`
- `refactor: simplify task parsing`

Guidelines:

- Keep one logical change per commit where practical.
- Put the user-visible behavior change in the subject, not only the implementation detail.
- Use the body when context matters: why the change exists, tradeoffs, migration notes, or validation performed.
- Mention issue or PR numbers when useful.
- Avoid vague subjects like `update`, `changes`, `fix stuff`, or `wip` in merge-ready history.
- For dependency updates, include the package names and the reason when the update is not routine.

Suggested commit body format:

```text
<type>: <imperative summary>

Why:
<short context for maintainers>

Validation:
- <command or manual check>
- <command or manual check>
```

## Pull Request Expectations

Before requesting review:

- Rebase or merge from the current main branch if the change has drifted.
- Confirm generated outputs such as `out/`, `.vite/`, logs, and local env files are not committed.
- Include screenshots for UI changes when possible.
- Include validation results, especially `npm run package` and any manual Toontown or room sync checks.
- Call out changes to release, update, packaging, or Task Hub behavior explicitly.

Review focus:

- Preserve Electron security posture unless a change has a clear reason. Main window Node integration is not enabled today.
- Keep renderer changes compatible with Vite and React.
- Be careful with network endpoints, auth headers, update publishing, and version metadata.
- Treat Companion App port scanning behavior as user-facing behavior.

## Release SOP

Releases are built through the manual GitHub Actions workflow and published through Electron Forge's GitHub publisher.

1. Make sure the target branch is ready and merged to `main`.
2. Choose the version bump:

   ```sh
   npm version patch -m "chore: release v%s"
   ```

   Replace `patch` with `major`, `minor`, `premajor`, `preminor`, `prepatch`, or `prerelease` as appropriate.

3. Confirm `package.json` and `package-lock.json` were updated together.
4. Run validation locally:

   ```sh
   npm test
   npm run package
   npm run verify:release-artifacts
   ```

   Run `npm run lint` too once the ESLint 9 config issue is resolved.

5. Push the version commit and tag created by `npm version`.
6. Go to the release workflow and manually run it:

   `https://github.com/jopika/ToontownHelper/actions/workflows/release.yml`

7. Wait for all matrix jobs to complete:

   - Linux: `ubuntu-latest`
   - Windows: `windows-latest`
   - macOS: `macos-latest`

8. Review the generated draft GitHub release:

   `https://github.com/jopika/ToontownHelper/releases`

9. Confirm artifacts are present for each supported platform and release notes look correct.
10. Publish the draft release.
11. After publishing, verify a previously installed client can discover or receive the new version.

The Forge publisher currently sets `prerelease: true`, `force: true`, and `generateReleaseNotes: true`. Check `forge.config.ts` before changing release semantics, because those settings affect how GitHub releases are created or overwritten.

The release workflow runs `npm test`, `npm run package`, and `npm run verify:release-artifacts` before `npm run action-publish`. Do not remove those gates without replacing them with equivalent release-artifact validation.

## Dependency Updates

Use `npm install` only when intentionally changing dependencies. Use `npm ci` for clean installs and CI parity.

When reviewing dependency updates:

- Check whether Electron, Electron Forge, Vite, TypeScript, or ESLint major versions require config migrations.
- Run packaging after Electron or Forge updates.
- Check release workflow compatibility with Node 20.
- Inspect lockfile changes for unexpected dependency churn.

## Operational Notes

- The Task Hub URL is currently hard-coded in `src/adapters/TaskHubConnector.ts`.
- Toontown local Companion App requests are made with a custom user agent and basic authorization prefix in `src/adapters/ToontownConnector.ts`.
- The app polls toon data every 10 seconds in `src/hooks/useToonData.ts`.
- Electron auto-update behavior is wired through `update-electron-app` in `src/main.ts`; `VersionManager` exists but is not active.
- Packaged output belongs in `out/` and should stay untracked.
- Test files, `tests/**`, `vitest.config.ts`, and test-only dependencies are explicitly ignored by Electron Forge packaging and checked again by the release artifact verifier.

## Maintainer Priorities

Good follow-up improvements for maintainability:

- Migrate ESLint to flat config or pin/configure ESLint so `npm run lint` works.
- Document or configure Task Hub environments for local development.
- Add a lightweight CI validation workflow for pull requests.
- Consider adding a release checklist template to GitHub issues or pull requests.
