import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meal', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.boolean('withinDiet').notNullable()
    table.uuid('user_id').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meal')
}
