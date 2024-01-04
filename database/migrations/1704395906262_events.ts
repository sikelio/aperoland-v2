import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'events'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .string('address', 255)
        .nullable()
        .defaultTo(null)
        .after('join_code');

      table
        .double('lat', 9, 6)
        .nullable()
        .defaultTo(null)
        .after('address');

      table
        .double('long', 9, 6)
        .nullable()
        .defaultTo(null)
        .after('lat');
    });
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table
        .dropColumn('address');

      table
        .dropColumn('lat');

      table
        .dropColumn('long');
    });
  }
}
