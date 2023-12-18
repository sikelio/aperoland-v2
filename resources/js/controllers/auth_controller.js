import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import axios from 'axios';
import Swal from 'sweetalert2';

export default class extends Controller {
	async handleLogin(e) {
		e.preventDefault();

		const username = $(e.target).find('[name="uid"]').val();
		const password = $(e.target).find('[name="password"]').val();

		try {
			await this.post('/auth/login', {
				uid: username,
				password
			});

			location.href = '/app'
		} catch (error) {
			Swal.fire({
				title: error.response.statusText,
				text: error.response.data.message,
				icon: 'error'
			});
		}
	}

	async handleRegister(e) {
		e.preventDefault();

		const username = $(e.target).find('[name="username"]').val();
		const email = $(e.target).find('[name="email"]').val();
		const password = $(e.target).find('[name="password"]').val();
		const confirmPassword = $(e.target).find('[name="confirmPassword"]').val();

		if (password !== confirmPassword) {
			return Swal.fire({
				title: 'Vérification requise',
				text: 'Les mots de passe ne correspondent pas',
				icon: 'warning'
			});
		}

		try {
			await this.post('/auth/register', {
				username,
				email,
				password,
				confirmPassword
			});

			location.href = '/app/home';
		} catch (error) {
			Swal.fire({
				title: error.response.data.message,
				text: error.response.data.reasons.join(', '),
				icon: 'error'
			});
		}
	}

	post(url, data) {
		return axios.post(url, data);
	}
}
