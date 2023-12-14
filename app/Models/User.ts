import { DateTime } from 'luxon';
import { BaseModel, HasMany, column, hasMany } from '@ioc:Adonis/Lucid/Orm';

import Event from './Event';

export default class User extends BaseModel {
  public static table = 'users';

  @column({ columnName: 'id_user', isPrimary: true })
  public id: number

  @hasMany(() => Event)
  public events: HasMany<typeof Event>

  @column({ columnName: 'username' })
  public username: string;

  @column({ columnName: 'email' })
  public email: string;

  @column({ columnName: 'password', serializeAs: null })
  public password: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
