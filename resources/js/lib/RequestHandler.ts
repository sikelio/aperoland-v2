import axios from 'axios';

export default class RequestHandler {
  static errorHandler(reasons: string[]) {
    return reasons.join(', <br>');
  }

  static post(url: string, data: any) {
    return axios.post(url, data);
  }
}
