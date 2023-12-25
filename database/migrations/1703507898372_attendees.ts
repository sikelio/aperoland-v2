import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'attendees'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table
        .integer('user_id')
        .unsigned()
        .references('users.user_id')
        .onDelete('CASCADE');

      table
        .increments('event_id')
        .unsigned()
        .references('events.event_id')
        .onDelete('CASCADE');

      table
        .unique(['user_id', 'event_id']);

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
        .defaultTo(this.now());
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
