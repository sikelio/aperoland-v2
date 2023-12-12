import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import axios from 'axios';
import Swal from 'sweetalert2';

export default class extends Controller {
    async handleLogin(e) {
        e.preventDefault();

        const username = $(e.target).find('[name="username"]').val();
        const password = $(e.target).find('[name="password"]').val();

        try {
            let res = await this.post('/login', {
                username,
                password
            });
    
            location.href = '/app'
        } catch (error) {
            Swal.fire({
                title: error.response.statusText,
                text: error.response.data.message,
                icon: 'error',
                timer: 3000
            });
        }
    }

    post(url, data) {
        return axios.post(url, data);
    }
}
