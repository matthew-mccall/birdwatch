import path from 'path'

const {
  DATABASE_CLIENT,
  DATABASE_URL
} = process.env

/** @type {import('knex').Knex.Config} */
export default {
  client: DATABASE_CLIENT,
  connection: DATABASE_URL,
  migrations: {
    directory: path.resolve(process.cwd(), 'db/migrations'),
    loadExtensions: ['.mjs']
  }
}
