import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Roles from 'App/Enums/Roles'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table
        .increments('role_id')

      table
        .string('name', 50)
        .notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table
        .timestamp('created_at', { useTz: true })

      table
        .timestamp('updated_at', { useTz: true })
    })

    this.defer(async (db) => {
      await db.table(this.tableName)
        .multiInsert([{
          role_id: Roles.ADMIN,
          name: 'Admin'
        }, {
          role_id: Roles.USER,
          name: 'User'
        }])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
