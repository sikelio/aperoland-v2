import { Controller } from '@hotwired/stimulus';
import $ from 'jquery'

export default class extends Controller {
  static targets: string[] = ['output'];

  declare readonly outputTarget: HTMLElement;

  connect(): JQuery<Element> {
    const maxLength: string | 1000 = $(this.element).find('[name="description"]').attr('maxLength') || 1000;
    const currentLength: number = ($(this.element).find('[name="description"]').val() as string).length;

    return $(this.outputTarget).text(`${currentLength} / ${maxLength}`);
  }

  update(): JQuery<Element> {
    const maxLength: string | 1000 = $(this.element).find('[name="description"]').attr('maxLength') || 1000;
    const currentLength: number = ($(this.element).find('[name="description"]').val() as string).length;

    return $(this.outputTarget).text(`${currentLength} / ${maxLength}`);
  }
}
