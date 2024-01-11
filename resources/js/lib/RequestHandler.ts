import axios from 'axios';

import type { AxiosResponse } from 'axios';

export default class RequestHandler {
	public static errorHandler(reasons: string[]): string {
		return reasons.join(', <br>');
	}

	public static post(url: string, data: any = {}): Promise<AxiosResponse<any, any>> {
		return axios.post(url, data);
	}

	public static delete(url: string, data: any = {}): Promise<AxiosResponse<any, any>> {
		return axios.delete(url, {
			data: data,
		});
	}

	public static get(url: string, data: any = {}): Promise<AxiosResponse<any, any>> {
		return axios.get(url, {
			data: data,
		});
	}

  public static patch(url: string, data: any = {}): Promise<AxiosResponse<any, any>> {
    return axios.patch(url, data);
  }

  public static put(url: string, data: any = {}) {
    return axios.put(url, data);
  }
}
