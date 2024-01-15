import BaseSchema from '@ioc:Adonis/Lucid/Schema';

export default class extends BaseSchema {
  protected tableName = 'users';

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .string('spotify_access_token', 255)
        .nullable()
        .after('password');

      table
        .string('spotify_refresh_token', 255)
        .nullable()
        .after('spotify_access_token');
    });
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .dropColumn('spotify_access_token');

      table
        .dropColumn('spotify_refresh_token');
    });
  }
}
