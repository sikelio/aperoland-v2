import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';

export default class extends Controller {
	connect(): void {
		!localStorage.getItem('cookieConsent') ? $(this.element).show() : $(this.element).hide();
	}

	accept(): void {
		localStorage.setItem('cookieConsent', 'accepted');

		$(this.element).hide();
	}

	decline(): void {
		localStorage.setItem('cookieConsent', 'declined');

		$(this.element).hide();
	}
}
