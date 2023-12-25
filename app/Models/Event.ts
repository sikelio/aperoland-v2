import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, ManyToMany, belongsTo, column, computed, manyToMany } from '@ioc:Adonis/Lucid/Orm';

import User from './User';

export default class Event extends BaseModel {
  @column({ columnName: 'event_id', isPrimary: true })
  public id: number;

  @column({ columnName: 'creator_id' })
  public creatorId: number;

  @column({ columnName: 'event_name' })
  public eventName: string;

  @column({ columnName: 'description' })
  public description: string;

  @column.dateTime({ columnName: 'start_datetime' })
  public startDateTime: DateTime;

  @column.dateTime({ columnName: 'end_datetime' })
  public endDateTime: DateTime;

  @belongsTo(() => User, {
    foreignKey: 'creator_id',
  })
  public creator: BelongsTo<typeof User>;

  @manyToMany(() => User, {
    pivotTable: 'attendees',
    localKey: 'id',
    pivotForeignKey: 'event_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'user_id',
  })
  public attendees: ManyToMany<typeof User>;

  private tempUserId: number;

  public setTempUserId(userId: number) {
    this.tempUserId = userId;
  }

  @computed()
  public get isCreator() {
    return this.creatorId === this.tempUserId;
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
