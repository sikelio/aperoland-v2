import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import Env from '@ioc:Adonis/Core/Env';
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
}
