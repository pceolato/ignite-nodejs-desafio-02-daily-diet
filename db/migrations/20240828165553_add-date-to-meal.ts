import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meal', (table) => {
    table.timestamp('date').notNullable().index()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meal', (table) => {
    table.dropColumn('date')
  })
}
