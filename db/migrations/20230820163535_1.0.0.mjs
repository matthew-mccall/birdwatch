
/**
 * @param   {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const up = (knex) => {
  return knex.schema
    .createTableIfNotExists('watchers', (table) => {
      table.string('email', 255).primary()
      table.specificType('crns', 'char(5) ARRAY')
    })
}

/**
 * @param   {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const down = (knex) => {
  return knex.schema
    .dropTableIfExists('watchers')
}
