import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import axios from 'axios';
import CustomSweetAlert from '../lib/CustomSweetAlert';

import type { SweetAlertResult } from 'sweetalert2';

export default class extends Controller {
	static targets = ['menu', 'mobileMenu'];

	declare readonly menuTarget: HTMLElement;
	declare readonly mobileMenuTarget: HTMLElement;

	toggleAvatarDropdown(e: Event): void {
		e.preventDefault();

		$(this.menuTarget).toggleClass('hidden');
	}

	toggleMobileAvatarDropdown(e: Event): void {
		e.preventDefault();

		$(this.mobileMenuTarget).toggleClass('hidden');
	}

	async logout(e: Event): Promise<'/auth/login' | SweetAlertResult<any>> {
		e.preventDefault();

		try {
			await axios.post('/auth/logout');

			localStorage.removeItem('chatToken');

			return (location.href = '/auth/login');
		} catch (error: any) {
			return CustomSweetAlert.Toast.fire({
				icon: 'warning',
				text: "Quelque chose s'est mal passé lors de la déconnexion !",
			});
		}
	}
}
