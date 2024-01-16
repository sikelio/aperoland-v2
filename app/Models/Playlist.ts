import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm';

import Event from './Event';
import Song from './Song';

export default class Playlist extends BaseModel {
  @column({ columnName: 'playlist_id', isPrimary: true })
  public id: number;

  @column({ columnName: 'event_id' })
  public eventId: number;

  @column({ columnName: 'playlist_name' })
  public playlistName: string;

  @column({ columnName: 'spotify_playlist_id' })
  public spotifyPlaylistId: string;

  @belongsTo(() => Event)
  public event: BelongsTo<typeof Event>;

  @hasMany(() => Song)
  public songs: HasMany<typeof Song>;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
