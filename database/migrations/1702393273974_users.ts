import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table
        .increments('user_id')
        .primary()

      table
        .string('username', 255)
        .notNullable()
        .unique()

      table
        .string('email', 100)
        .notNullable()
        .unique()

      table
        .string('password', 255)

      table
        .string('remember_me_token')
        .nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table
        .timestamp('created_at', { useTz: true })

      table
        .timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
