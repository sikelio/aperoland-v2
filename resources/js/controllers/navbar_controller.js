import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import axios from 'axios';
import CustomSweetAlert from '../lib/CustomSweetAlert';

export default class extends Controller {
  static targets = ['menu', 'mobileMenu'];

  toggleAvatarDropdown(e) {
    e.preventDefault();

    $(this.menuTarget).toggleClass('hidden');
  }

  toggleMobileAvatarDropdown(e) {
    e.preventDefault();

    $(this.mobileMenuTarget).toggleClass('hidden');
  }

  async logout(e) {
    e.preventDefault();

    try {
      await axios.post('/auth/logout');

      location.href = '/auth/login';
    } catch (error) {
      CustomSweetAlert.Toast.fire({
        icon: 'warning',
        text: 'Quelque chose s\'est mal passé lors de la déconnexion !'
      });
    }
  }
}
