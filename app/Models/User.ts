import Hash from '@ioc:Adonis/Core/Hash';
import { DateTime } from 'luxon';
import {
  BaseModel,
  BelongsTo,
  HasMany,
  beforeSave,
  belongsTo,
  column,
  computed,
  hasMany,
} from '@ioc:Adonis/Lucid/Orm';

import Event from './Event';
import Role from './Role';
import Roles from 'App/Enums/Roles';

export default class User extends BaseModel {
  public static table = 'users';

  @column({ columnName: 'user_id', isPrimary: true })
  public id: number;

  @column({ columnName: 'role_id' })
  public roleId: number;

  @hasMany(() => Event)
  public events: HasMany<typeof Event>;

  @column({ columnName: 'username' })
  public username: string;

  @column({ columnName: 'email' })
  public email: string;

  @column({ columnName: 'password', serializeAs: null })
  public password: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @computed()
  public get isAdmin() {
    return this.roleId === Roles.ADMIN;
  }

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>;

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }
}
