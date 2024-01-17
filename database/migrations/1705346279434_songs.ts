import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'songs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table
        .charset('utf8');

			table
        .engine('InnoDB');

      table
        .increments('song_id')
        .primary()
        .notNullable();

      table
        .string('title', 255)
        .notNullable();

      table
        .string('artist', 255)
        .notNullable();

      table
        .integer('playlist_id')
        .unsigned()
        .notNullable()
        .references('playlist_id')
        .inTable('playlists')
        .onDelete('CASCADE');

      table
        .string('spotify_preview_url', 255)
        .nullable();

      table
        .string('spotify_image_url', 255)
        .nullable();

      table
        .timestamp('created_at', { useTz: true });

      table
        .timestamp('updated_at', { useTz: true });
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
