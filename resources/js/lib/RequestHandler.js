import axios from 'axios';

export default class RequestHandler {
	/**
	 * Returns reasons as a single string.
	 * @param {String[]} reasons 
	 * @returns {String}
	 */
	static errorHandler(reasons) {
		return reasons.join(', <br>');
	}

	/**
	 * Make a post request.
	 * @param {String} url 
	 * @param {Object} data 
	 * @returns {Promise<AxiosResponse<any, any>>}
	 */
	static post(url, data) {
		return axios.post(url, data);
	}
}
