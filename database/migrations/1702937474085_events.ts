import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'events';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .charset('utf8');

      table
        .engine('InnoDB');

      table
        .collate('utf8_unicode_ci');

      table
        .increments('event_id')
        .primary();

      table
        .integer('creator_id')
        .unsigned()
        .references('user_id')
        .inTable('users');

      table
        .string('event_name', 255)
        .notNullable();

      table
        .text('description')
        .nullable();

      table
        .dateTime('start_datetime')
        .notNullable();

      table
        .dateTime('end_datetime')
        .notNullable();

      table
        .string('join_code', 18)
        .notNullable();

      table
        .timestamp('created_at', { useTz: true });

      table
        .timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
