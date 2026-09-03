import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const packageJson = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
) as { packageManager?: string }
const workflow = readFileSync(
  new URL('../.github/workflows/deploy.yml', import.meta.url),
  'utf8',
)

test('pins the deployment package manager to a Node 18 compatible release', () => {
  assert.equal(packageJson.packageManager, 'pnpm@10.34.5')
  assert.match(workflow, /npm install -g pnpm@10\.34\.5/)
  assert.doesNotMatch(workflow, /npm install -g pnpm\s*(?:#.*)?$/m)
})
