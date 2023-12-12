import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import axios from 'axios';

export default class extends Controller {
    async handleLogin(e) {
        e.preventDefault();

        let res = await this.post('/login', {
            username: $(e.target).find('[name="username"]').val(),
            password: $(e.target).find('[name="password"]').val()
        });

        console.log(res);
    }

    post(url, data) {
        return axios.post(url, data);
    }
}
