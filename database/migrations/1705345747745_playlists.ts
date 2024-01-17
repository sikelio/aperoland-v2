import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'playlists'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table
        .charset('utf8');

			table
        .engine('InnoDB');

      table
        .increments('playlist_id')
        .notNullable()
        .primary();

      table
        .integer('event_id')
        .unsigned()
        .notNullable()
        .references('event_id')
        .inTable('events')
        .onDelete('CASCADE');

      table
        .string('playlist_name', 255)
        .notNullable();

      table
        .string('spotify_playlist_id', 255)
        .notNullable();

      table
        .timestamp('created_at', { useTz: true });

      table
        .timestamp('updated_at', { useTz: true });
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName);
  }
}
