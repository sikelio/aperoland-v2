import { DateTime } from 'luxon';
import {
	BaseModel,
	BelongsTo,
	HasMany,
	ManyToMany,
	belongsTo,
	column,
	computed,
	hasMany,
	manyToMany,
} from '@ioc:Adonis/Lucid/Orm';

import User from './User';
import ChatMessage from './ChatMessage';

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

	@column({ columnName: 'join_code' })
	public joinCode: string;

	@column({ columnName: 'address' })
	public address: string;

	@column({ columnName: 'lat' })
	public lat: number;

	@column({ columnName: 'long' })
	public long: number;

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

	@hasMany(() => ChatMessage)
	public messages: HasMany<typeof ChatMessage>;

	private tempUserId: number;
  private tempStart: string;
  private tempEnd: string;

	public setTempUserId(userId: number) {
		this.tempUserId = userId;
	}

  public setTempStart(date: string) {
    this.tempStart = date;
  }

  public setTempEnd(date: string) {
    this.tempEnd = date;
  }

	@computed()
	public get isCreator(): boolean {
		return this.creatorId === this.tempUserId;
	}

  @computed()
  public get tempStartDatetime(): string {
    return this.tempStart;
  }

  @computed()
  public get tempEndDatetime(): string {
    return this.tempEnd;
  }

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;
}
