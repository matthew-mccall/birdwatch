
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
  return knex.schema
    .alterTable('watchers', (table) => {
      table.dropPrimary()
    })
      .then(() => knex.schema
        .alterTable('watchers', (table) => {
          table.integer('crn').primary().alter()
      }))
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
  return knex.schema
    .alterTable('watchers', (table) => {
      table.dropPrimary()
    })
      .then(() => knex.schema
        .alterTable('watchers', (table) => {
          table.specificType('crn', 'char(5)').primary().alter()
      }))
}
