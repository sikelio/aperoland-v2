import { Controller } from '@hotwired/stimulus';
import $ from 'jquery'

export default class extends Controller {
  static targets = ['output'];
  outputTarget: Element;

  connect() {
    const maxLength = $(this.element).find('[name="description"]').attr('maxLength') || 1000;
    const currentLength = ($(this.element).find('[name="description"]').val() as string).length;

    $(this.outputTarget).text(`${currentLength} / ${maxLength}`);
  }

  update() {
    const maxLength = $(this.element).find('[name="description"]').attr('maxLength') || 1000;
    const currentLength = ($(this.element).find('[name="description"]').val() as string).length;

    $(this.outputTarget).text(`${currentLength} / ${maxLength}`);
  }
}
