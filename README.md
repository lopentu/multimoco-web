# Multimoco Web frontend

## Deployment (CI/CD)

Pushing to `main` automatically builds and deploys the app via GitHub Actions. The workflow:
1. Checks out the code on the self-hosted runner
2. Installs dependencies with pnpm
3. Builds the app
4. Restarts the pm2 process

Monitor deployments in the **Actions** tab on GitHub, or on the server:
```bash
gh run watch        # stream current run in terminal
pm2 logs multimoco  # tail app logs after deploy
```

Environment variables (`MONGODB_URI`, `MONGO_DB`, `GC_API_KEY`) are managed as repository secrets in GitHub (**Settings → Secrets and variables → Actions**).

## Process Management (pm2)

This service is managed by [pm2](https://pm2.keymetrics.io/). The process runs from the GitHub Actions runner workspace. Common commands:

```bash
pm2 ls                  # list all managed processes and their status
pm2 info multimoco      # show process details including working directory
pm2 stop multimoco      # stop the service
pm2 restart multimoco   # restart the service
pm2 reload multimoco    # zero-downtime reload
pm2 logs multimoco      # tail logs
pm2 save                # persist process list across reboots
pm2 startup             # generate startup script for the system
```

To set up pm2 for the first time on the runner workspace:
```bash
cd /opt/github-runners/runner-01/_work/multimoco-web/multimoco-web
pm2 start "npm run start" --name multimoco
pm2 save
```

## Prerequisites

- Node.js 18.20.4 (see `.nvmrc`)
- pnpm
- MongoDB server — connection set via `MONGODB_URI` environment variable

Copy `.env.local.example` to `.env.local` and fill in values for local development:
```
MONGODB_URI=...
MONGO_DB=...
GC_API_KEY=...
```

The codebase is bootstrapped with `create-next-app`.

## Local Development

```bash
pnpm install
pnpm run dev
```

## Build & Export (Static)

For the GitHub Pages static export:

* Checkout static-render branch, merge other branches if necessary
```bash
git checkout static-render
```

* Set environment variable
```bash
export MULTIMOCO_STATIC_BUILD=1
```

* Build
```bash
pnpm next build && pnpm next export -o docs
```

* Make sure `.nojekyll` is present in `docs/` (GitHub Pages needs it to disable Jekyll)

* Push to GitHub
```bash
git push
```
