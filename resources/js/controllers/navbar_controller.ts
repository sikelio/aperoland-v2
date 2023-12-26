import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import axios from 'axios';
import CustomSweetAlert from '../lib/CustomSweetAlert';

export default class extends Controller {
  static targets = ['menu', 'mobileMenu'];
  menuTarget: Element;
  mobileMenuTarget: Element;

  toggleAvatarDropdown(e: any) {
    e.preventDefault();

    $(this.menuTarget).toggleClass('hidden');
  }

  toggleMobileAvatarDropdown(e: any) {
    e.preventDefault();

    $(this.mobileMenuTarget).toggleClass('hidden');
  }

  async logout(e: any) {
    e.preventDefault();

    try {
      await axios.post('/auth/logout');

      location.href = '/auth/login';
    } catch (error: any) {
      CustomSweetAlert.Toast.fire({
        icon: 'warning',
        text: 'Quelque chose s\'est mal passé lors de la déconnexion !'
      });
    }
  }
}
