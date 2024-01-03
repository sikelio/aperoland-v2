import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import Swal from 'sweetalert2';
import RequestHandler from '../lib/RequestHandler';
import CustomSweetAlert from '../lib/CustomSweetAlert';

import type { SweetAlertResult } from 'sweetalert2';

export default class extends Controller {
  async handleLogin(e: Event): Promise<JQuery<HTMLElement> | SweetAlertResult<any> | '/app/home'> {
    e.preventDefault();

    if (
      localStorage.getItem('cookieConsent') === 'declined' ||
      !localStorage.getItem('cookieConsent')
    ) {
      CustomSweetAlert.Toast.fire({
        icon: 'warning',
        text: 'Veuillez accepter les cookies afin de pouvoir vous connecter !',
      });

      return $('#cookieConsentPopup').show();
    }

    const uid: string = $(e.currentTarget as HTMLElement)
      .find('[name="uid"]')
      .val() as string;
    const password: string = $(e.currentTarget as HTMLElement)
      .find('[name="password"]')
      .val() as string;

    try {
      const response = await RequestHandler.post('/auth/login', {
        uid,
        password,
      });

      localStorage.setItem('chatToken', response.data.token);

      return (location.href = '/app/home');
    } catch (error: any) {
      return Swal.fire({
        title: error.response.statusText,
        text: error.response.data.message,
        icon: 'error',
      });
    }
  }

  async handleRegister(
    e: Event
  ): Promise<JQuery<HTMLElement> | SweetAlertResult<any> | '/app/home'> {
    e.preventDefault();

    if (
      localStorage.getItem('cookieConsent') === 'declined' ||
      !localStorage.getItem('cookieConsent')
    ) {
      CustomSweetAlert.Toast.fire({
        icon: 'warning',
        text: 'Veuillez accepter les cookies afin de pouvoir vous inscrire !',
      });

      return $('#cookieConsentPopup').show();
    }

    const username: string = $(e.currentTarget as HTMLElement)
      .find('[name="username"]')
      .val() as string;
    const email: string = $(e.currentTarget as HTMLElement)
      .find('[name="email"]')
      .val() as string;
    const password: string = $(e.currentTarget as HTMLElement)
      .find('[name="password"]')
      .val() as string;
    const confirmPassword: string = $(e.currentTarget as HTMLElement)
      .find('[name="confirmPassword"]')
      .val() as string;

    if (password !== confirmPassword) {
      return Swal.fire({
        title: 'Vérification requise',
        text: 'Les mots de passe ne correspondent pas',
        icon: 'warning',
      });
    }

    try {
      await RequestHandler.post('/auth/register', {
        username,
        email,
        password,
        confirmPassword,
      });

      return (location.href = '/app/home');
    } catch (error: any) {
      return Swal.fire({
        title: error.response.data.message,
        html: RequestHandler.errorHandler(error.response.data.reasons),
        icon: 'error',
      });
    }
  }
}
