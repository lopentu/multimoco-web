export type DatabaseHealth = {
  status: 200 | 503
  body: {
    status: 'healthy' | 'unhealthy'
    database: 'connected' | 'disconnected'
  }
}

type PingableDatabase = {
  command(command: { ping: 1 }): Promise<unknown>
}

async function withTimeout<T>(operation: Promise<T>, timeoutMs: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_resolve, reject) => {
    timer = setTimeout(() => reject(new Error('database health check timed out')), timeoutMs)
  })

  try {
    return await Promise.race([operation, timeout])
  } finally {
    if (timer) clearTimeout(timer)
  }
}

export async function checkDatabaseHealth(
  getDatabase: () => Promise<PingableDatabase>,
  timeoutMs = 2_000,
): Promise<DatabaseHealth> {
  try {
    await withTimeout(
      (async () => {
        const database = await getDatabase()
        await database.command({ ping: 1 })
      })(),
      timeoutMs,
    )
    return {
      status: 200,
      body: { status: 'healthy', database: 'connected' },
    }
  } catch {
    return {
      status: 503,
      body: { status: 'unhealthy', database: 'disconnected' },
    }
  }
}
