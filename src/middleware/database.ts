import Knex from 'knex'

import { env } from '~/env.mjs'

const {
  DATABASE_CLIENT,
  DATABASE_URL
} = env

export const db = Knex({
  client: DATABASE_CLIENT,
  connection: DATABASE_URL
})
