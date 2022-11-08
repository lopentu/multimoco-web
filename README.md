# Multimoco Web frontend

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

