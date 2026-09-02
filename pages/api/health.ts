import type { NextApiRequest, NextApiResponse } from 'next'

import { checkDatabaseHealth, DatabaseHealth } from '../../lib/database_health'
import clientPromise from '../../lib/mongodb'

export default async function handler(
  _request: NextApiRequest,
  response: NextApiResponse<DatabaseHealth['body']>,
) {
  const result = await checkDatabaseHealth(async () => {
    const client = await clientPromise
    return client.db(process.env.MONGO_DB || 'multimoco')
  })

  response.setHeader('Cache-Control', 'no-store')
  response.status(result.status).json(result.body)
}
