import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

import User from './User';

export default class Event extends BaseModel {
  @column({ columnName: 'id_event', isPrimary: true })
  public id: number

  @belongsTo(() => User, {
    foreignKey: 'creator_id'
  })
  public creator: BelongsTo<typeof User>

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
