import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import Swal from 'sweetalert2';
import RequestHandler from '../lib/RequestHandler';
import CustomSweetAlert from '../lib/CustomSweetAlert';

export default class extends Controller {
  async handleLogin(e: any) {
    e.preventDefault();

    if (localStorage.getItem('cookieConsent') === 'declined' || !localStorage.getItem('cookieConsent')) {
      CustomSweetAlert.Toast.fire({
        icon: 'warning',
        text: 'Veuillez accepter les cookies afin de pouvoir vous connecter !'
      });

      return $('#cookieConsentPopup').show();
    }

    const username = $(e.target).find('[name="uid"]').val();
    const password = $(e.target).find('[name="password"]').val();

    try {
      await RequestHandler.post('/auth/login', {
        uid: username,
        password,
      });

      location.href = '/app/home';
    } catch (error: any) {
      Swal.fire({
        title: error.response.statusText,
        text: error.response.data.message,
        icon: 'error',
      });
    }
  }

  async handleRegister(e: any) {
    e.preventDefault();

    if (localStorage.getItem('cookieConsent') === 'declined' || !localStorage.getItem('cookieConsent')) {
      CustomSweetAlert.Toast.fire({
        icon: 'warning',
        text: 'Veuillez accepter les cookies afin de pouvoir vous inscrire !'
      });

      return $('#cookieConsentPopup').show();
    }

    const username = $(e.target).find('[name="username"]').val();
    const email = $(e.target).find('[name="email"]').val();
    const password = $(e.target).find('[name="password"]').val();
    const confirmPassword = $(e.target).find('[name="confirmPassword"]').val();

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

      location.href = '/app/home';
    } catch (error: any) {
      Swal.fire({
        title: error.response.data.message,
        html: RequestHandler.errorHandler(error.response.data.reasons),
        icon: 'error',
      });
    }
  }
}
