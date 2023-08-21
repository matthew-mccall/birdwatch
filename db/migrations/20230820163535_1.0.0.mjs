
/**
 * @param   {import('knex').Knex} knex
 * @returns {Promise<void>}
 */
export const up = (knex) => {
  return knex.schema
    .createTableIfNotExists('watchers', (table) => {
      table.specificType('crn', 'char(5)').primary()
      table.specificType('emails', 'varchar(255) ARRAY')
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
