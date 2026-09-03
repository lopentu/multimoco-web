import assert from 'node:assert/strict'
import test from 'node:test'

import { checkDatabaseHealth } from '../lib/database_health'

test('reports a connected database after a successful ping', async () => {
  const commands: object[] = []
  const result = await checkDatabaseHealth(async () => ({
    command: async (command) => {
      commands.push(command)
    },
  }))

  assert.deepEqual(commands, [{ ping: 1 }])
  assert.deepEqual(result, {
    status: 200,
    body: { status: 'healthy', database: 'connected' },
  })
})

test('reports an unavailable database without leaking error details', async () => {
  const result = await checkDatabaseHealth(async () => ({
    command: async () => {
      throw new Error('mongodb://secret-host:27017')
    },
  }))

  assert.deepEqual(result, {
    status: 503,
    body: { status: 'unhealthy', database: 'disconnected' },
  })
  assert.doesNotMatch(JSON.stringify(result), /secret-host/)
})

test('reports an unavailable database when connecting fails', async () => {
  const result = await checkDatabaseHealth(async () => {
    throw new Error('connection refused')
  })

  assert.deepEqual(result, {
    status: 503,
    body: { status: 'unhealthy', database: 'disconnected' },
  })
})

test('bounds the health check when the database never responds', async () => {
  const startedAt = Date.now()
  const result = await checkDatabaseHealth(
    async () => new Promise(() => undefined),
    10,
  )

  assert.equal(result.status, 503)
  assert.ok(Date.now() - startedAt < 500)
})
