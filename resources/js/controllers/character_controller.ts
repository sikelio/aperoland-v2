import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';

export default class extends Controller {
  static targets: string[] = ['output'];

  declare readonly outputTarget: HTMLElement;

  connect(): JQuery<Element> {
    const maxLength: string | 255 =
      $(this.element).find('[name="description"]').attr('maxLength') || 255;
    const currentLength: number = ($(this.element).find('[name="description"]').val() as string)
      .length;

    if (currentLength > 255 || currentLength < 0) {
      $(this.outputTarget)
        .removeClass('text-white')
        .addClass('text-red-600');
    } else {
      $(this.outputTarget)
        .removeClass('text-red-600')
        .addClass('text-white');
    }

    return $(this.outputTarget).text(`${currentLength} / ${maxLength}`);
  }

  update(): JQuery<Element> {
    const maxLength: string | 255 =
      $(this.element).find('[name="description"]').attr('maxLength') || 255;
    const currentLength: number = ($(this.element).find('[name="description"]').val() as string)
      .length;

    if (currentLength > 255 || currentLength < 0) {
      $(this.outputTarget)
        .removeClass('text-white')
        .addClass('text-red-600');
    } else {
      $(this.outputTarget)
        .removeClass('text-red-600')
        .addClass('text-white');
    }

    return $(this.outputTarget).text(`${currentLength} / ${maxLength}`);
  }
}
