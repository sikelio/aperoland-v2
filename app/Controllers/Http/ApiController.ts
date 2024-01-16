import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';
import User from 'App/Models/User';
import Event from 'App/Models/Event';
import Playlist from 'App/Models/Playlist';
import spotify from 'App/Services/SpotifyApi';
import axios from 'axios';

import type { AxiosResponse } from 'axios';

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
      spotify.createPlaylist(playlistName, { public: true })
        .then(async (data) => {
          await Playlist.create({
            playlistName: playlistName,
            spotifyPlaylistId: data.body.id,
            eventId: event.id
          });

          return response.send({
            message: 'Playlist créée',
            success: true
          });
        }, () => {
          return response.status(500).send({
            message: 'Une erreur s\'est produite',
            success: false
          });
        });
    } catch (error: any) {
      return
    }
  }

  public async songSearch({ request, auth, response }: HttpContextContract) {
    let queryString = request.qs();

    try {
      const user: User = await User.findOrFail(auth.user!.id);

      spotify.setAccessToken(user.spotifyAccessToken);
      spotify.setRefreshToken(user.spotifyRefreshToken);
      spotify.searchTracks(queryString.q)
        .then((data) => {
          if (data.body === undefined) {
            return [];
          }

          if (data.body.tracks === undefined) {
            return [];
          }

          return response.send(data.body.tracks.items);
        }, (err) => {
          return response.status(err.statusCode).send([]);
        });
    } catch (error: any) {
      return response.status(500).send([]);
    }
  }
}
