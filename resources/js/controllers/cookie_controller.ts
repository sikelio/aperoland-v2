import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';

export default class extends Controller {
  connect() {
    if (!localStorage.getItem('cookieConsent')) {
      return $(this.element).show();
    }

    $(this.element).hide();
  }

  accept() {
    localStorage.setItem('cookieConsent', 'accepted');

    $(this.element).hide();
  }

  decline() {
    localStorage.setItem('cookieConsent', 'declined');

    $(this.element).hide();
  }
}
