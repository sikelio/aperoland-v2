import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';

export default class extends Controller {
  static targets = ['output'];

  connect() {
    const maxLength = $(this.element).find('[name="description"]').attr('maxLength') || 1000;
    const currentLength = $(this.element).find('[name="description"]').val().length;

    this.outputTarget.textContent = `${currentLength} / ${maxLength}`;
  }

  update() {
    const maxLength = $(this.element).find('[name="description"]').attr('maxLength') || 1000;
    const currentLength = $(this.element).find('[name="description"]').val().length;

    this.outputTarget.textContent = `${currentLength} / ${maxLength}`;
  }
}
