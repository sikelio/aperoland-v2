import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';

export default class extends Controller {
	connect(): JQuery<Element> {
		if (!localStorage.getItem('cookieConsent')) {
			return $(this.element).show();
		}

		return $(this.element).hide();
	}

	accept(): JQuery<Element> {
		localStorage.setItem('cookieConsent', 'accepted');

		return $(this.element).hide();
	}

	decline(): JQuery<Element> {
		localStorage.setItem('cookieConsent', 'declined');

		return $(this.element).hide();
	}
}
