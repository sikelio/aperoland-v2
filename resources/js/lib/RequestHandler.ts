import axios from 'axios';

import type { AxiosResponse } from 'axios';

export default class RequestHandler {
  static errorHandler(reasons: string[]): string {
    return reasons.join(', <br>');
  }

  static post(url: string, data: any = {}): Promise<AxiosResponse<any, any>> {
    return axios.post(url, data);
  }

  static delete(url: string, data: any): Promise<AxiosResponse<any, any>> {
    return axios.delete(url, {
      data: data
    });
  }
}
