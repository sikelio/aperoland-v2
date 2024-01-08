import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm';

import User from './User';
import Event from './Event';

export default class ChatMessage extends BaseModel {
	public static table = 'chat_messages';

	@column({ columnName: 'messageId', isPrimary: true })
	public id: number;

	@column({ columnName: 'user_id' })
	public userId: number;

	@column({ columnName: 'event_id' })
	public eventId: number;

	@column({ columnName: 'message' })
	public message: string;

	@column({ columnName: 'deleted' })
	public isDelete: boolean;

	@belongsTo(() => User, {
		foreignKey: 'userId',
	})
	public user: BelongsTo<typeof User>;

	@belongsTo(() => Event, {
		foreignKey: 'eventId',
	})
	public event: BelongsTo<typeof Event>;

	private tempUserId: number;

	public setTempUserId(id: number) {
		this.tempUserId = id;
	}

	@computed()
	public get isAuthor() {
		return this.userId === this.tempUserId;
	}

	@column.dateTime({ autoCreate: true })
	public createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	public updatedAt: DateTime;
}
