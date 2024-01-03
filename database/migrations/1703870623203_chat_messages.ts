import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'chat_messages';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.charset('utf8');

      table.engine('InnoDB');

      table.collate('utf8_unicode_ci');

      table.increments('message_id').primary();

      table
        .integer('user_id')
        .unsigned()
        .references('user_id')
        .inTable('users')
        .onDelete('SET NULL');

      table
        .integer('event_id')
        .unsigned()
        .references('event_id')
        .inTable('events')
        .onDelete('CASCADE');

      table.string('message', 255).notNullable();

      table.boolean('deleted').notNullable().defaultTo(false);

      table.timestamp('created_at', { useTz: true });

      table.timestamp('updated_at', { useTz: true });
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
