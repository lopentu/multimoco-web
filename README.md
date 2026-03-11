# Multimoco Web frontend

## Starting Server
Run `npm run start`

## Process Management (pm2)
This service is managed by [pm2](https://pm2.keymetrics.io/). Common commands:

```bash
pm2 ls                  # list all managed processes and their status
pm2 start "npm run start" --name multimoco  # start the app using pm2
pm2 stop multimoco      # stop the service
pm2 restart multimoco   # restart the service
pm2 reload multimoco    # zero-downtime reload
pm2 logs multimoco      # tail logs
pm2 save                # persist process list across reboots
pm2 startup             # generate startup script for the system
```

## Prerequisites

The frontend depends on a MongoDB server indicated by environment variable `MONGODB_URI`. The codebase is bootstrapped with `create-next-app`.

## Build & Export
* checkout static-render, merge other branches if necessary
`git checkout static-render `

* set environment variable
`$env:MULTIMOCO_STATIC_BUILD="1"`
or
`export MULTIMOCO_STATIC_BUILD=1`

* Build
`pnpm next build && pnpm next export -o docs`

* Add the file `.nojekyll`
Make sure `.nojekyll` is present in `docs/`. Gitpage needs it to disable Jekyll build.

* Push to Github
`git push`

