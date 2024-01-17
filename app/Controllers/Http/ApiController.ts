import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';
import User from 'App/Models/User';
import Event from 'App/Models/Event';
import Playlist from 'App/Models/Playlist';
import spotify from 'App/Services/SpotifyApi';
import Track from 'App/Interfaces/Track';
import axios from 'axios';

import type { AxiosResponse } from 'axios';
import Song from 'App/Models/Song';

export default class ApiController {
	public async location({ request, response }: HttpContextContract) {
		let queryString = request.qs();
		let url = `https://api.tomtom.com/search/2/geocode/${encodeURIComponent(
			queryString.q
		)}.json?key=${Env.get('TOMTOM_API_KEY')}`;

		await axios
			.get(url)
			.then((res: AxiosResponse<any, any>) => {
				let finalData: any[] = [];

				res.data.results.forEach((element) => {
					if (!element.address['coordinates']) {
						element.address['coordinates'] = [element.position.lat, element.position.lon];
					}

					finalData.push(element.address);
				});

				response.send(finalData);
			})
			.catch(() => {
				response.send([]);
			});
	}

  public async createPlaylist({ request, params, response, auth }: HttpContextContract) {
    try {
      const playlistName: string = request.input('playlistName');
      const user: User = await User.findOrFail(auth.user!.id);
      const event: Event = await Event.findOrFail(params.id);
      event.setTempUserId(user.id);

      if (!event.isCreator) {
        return response.status(403).send({
          message: 'Vous n\'êtes pas le créateur de cet Apéro',
          success: false
        });
      }

      spotify.setAccessToken(user.spotifyAccessToken);
      spotify.setRefreshToken(user.spotifyRefreshToken);
      const res = await spotify.createPlaylist(playlistName, { public: true })

      await Playlist.create({
        playlistName: playlistName,
        spotifyPlaylistId: res.body.id,
        eventId: event.id
      });

      return response.send({
        message: 'Playlist créée',
        success: true
      });
    } catch (error: any) {
      return response.status(500);
    }
  }

  public async songSearch({ request, auth, response }: HttpContextContract) {
    let queryString = request.qs();

    try {
      const user: User = await User.findOrFail(auth.user!.id);

      spotify.setAccessToken(user.spotifyAccessToken);
      spotify.setRefreshToken(user.spotifyRefreshToken);

      const data = await spotify.searchTracks(queryString.q);

      if (data.body === undefined) {
        return response.status(500).send([]);
      }

      if (data.body.tracks === undefined) {
        return response.status(500).send([]);
      }

      return response.send(data.body.tracks.items);
    } catch (error: any) {
      return response.status(500).send([]);
    }
  }

  public async addSong({ params, response, auth, request }: HttpContextContract) {
    const eventId = params.id;

    try {
      const user: User = await auth.use('web').authenticate();

      const event = await Event.findOrFail(eventId);
      await event.load('playlist');

      const tracks: Track[] = request.input('songs');
      const songs: string[] = [];
      const finalSongs: any[] = [];

      tracks.forEach((track: Track) => {
        songs.push(track.songId);
        finalSongs.push({
          title: track.title,
          artist: track.artist,
          spotifyPreviewUrl: track.previewUrl,
          spotifyImageUrl: track.imageUrl,
          playlistId: event.playlist.id,
        });
      });

      spotify.setAccessToken(user.spotifyAccessToken);
      spotify.setRedirectURI(user.spotifyRefreshToken);
      await spotify.addTracksToPlaylist(event.playlist.spotifyPlaylistId, songs);

      await Song.createMany(finalSongs);

      return response.send({
        message: 'Titre(s) ajouté avec succès',
        success: true,
        songs: finalSongs
      });
    } catch (error: any) {
      console.log(error);

      return response.status(500).send({});
    }
  }
}
