import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';
import User from 'App/Models/User';
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
