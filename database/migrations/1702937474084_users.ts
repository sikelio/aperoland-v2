import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import Roles from 'App/Enums/Roles';

export default class extends BaseSchema {
  protected tableName = 'users';

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table
        .charset('utf8');

      table
        .engine('InnoDB');

      table
        .collate('utf8_unicode_ci');

      table
        .increments('user_id')
        .primary();

      table
        .integer('role_id')
        .unsigned()
        .references('role_id')
        .inTable('roles')
        .defaultTo(Roles.USER);

      table
        .string('username', 255)
        .notNullable()
        .unique();

      table
        .string('email', 100)
        .notNullable()
        .unique();

      table
        .string('password', 255);

      table
        .string('remember_me_token')
        .nullable();

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
