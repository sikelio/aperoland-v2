import { DateTime } from 'luxon';
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm';
import Playlist from './Playlist';

export default class Song extends BaseModel {
  @column({ columnName: 'song_id', isPrimary: true })
  public id: number;

  @column({ columnName: 'title' })
  public title: string;

  @column({ columnName: 'artist' })
  public artist: string;

  @column({ columnName: 'spotify_preview_url' })
  public spotifyPreviewUrl: string;

  @column({ columnName: 'spotify_image_url' })
  public spotifyImageUrl: string;

  @column({ columnName: 'playlist_id' })
  public playlistId: number;

  @belongsTo(() => Playlist)
  public playlist: BelongsTo<typeof Playlist>;

  @computed()
  public get hasPreviewLink(): boolean {
    return this.spotifyPreviewUrl !== 'null';
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
