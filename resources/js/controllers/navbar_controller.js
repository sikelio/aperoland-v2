import { Controller } from '@hotwired/stimulus';
import axios from 'axios';

export default class extends Controller {
  static targets = ['menu', 'mobileMenu'];

  toggleAvatarDropdown(e) {
    e.preventDefault();

    this.menuTarget.classList.toggle('hidden');
  }

  toggleMobileAvatarDropdown(e) {
    e.preventDefault();

    this.mobileMenuTarget.classList.toggle('hidden');
  }

  async logout(e) {
    e.preventDefault();

    try {
      await axios.post('/auth/logout');

      location.href = '/auth/login';
    } catch (error) {
      console.error(error);
    }
  }
}
