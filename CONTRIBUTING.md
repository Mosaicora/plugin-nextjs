# Contributing

Thanks for your interest in improving this repository.

## Local development

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Run the validation commands:

   ```bash
   pnpm test
   pnpm typecheck
   npm pack --dry-run
   ```

## Contribution guidelines

- Keep changes focused and explain the user-facing motivation in the pull request.
- Prefer small, reviewable commits over large mixed refactors.
- Update documentation when behavior, public APIs, or local workflows change.
- Add or update tests for meaningful behavior changes.
- Follow the existing TypeScript and React style in the repo.

## Working with related Mosaicora repos

This repo depends on the lower-level
[`@mosaicora/plugin-mosaicora-core`](https://github.com/Mosaicora/plugin-mosaicora-core)
package. Changes that span both repos should be coordinated through versioned
package updates rather than local layout assumptions.

## Issues and security

- Use GitHub issues for bugs, questions, and feature requests.
- Do not report security issues publicly. See [SECURITY.md](./SECURITY.md).
