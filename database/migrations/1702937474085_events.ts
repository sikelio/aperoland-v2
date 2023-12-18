import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'events';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('event_id').primary();

      table.integer('creator_id').unsigned().notNullable();

      table.string('event_name', 255).notNullable();

      table.text('description').nullable();

      table.dateTime('start_datetime').notNullable();

      table.dateTime('end_datetime').notNullable();

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true });

      table.timestamp('updated_at', { useTz: true });

      table.foreign('creator_id').references('user_id').inTable('users').onDelete('CASCADE');
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
