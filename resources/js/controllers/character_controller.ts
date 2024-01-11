import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';

export default class extends Controller {
	static targets: string[] = ['output'];

	declare readonly outputTarget: HTMLElement;

	private readonly maxLength: number = 255;

	public connect(): void {
		this.update();
	}

	public update(): void {
		const currentLength: number = ($(this.element).find('[name="description"]').val() as string)
			.length;

		this.applyColor(currentLength);

		$(this.outputTarget).text(`${currentLength} / ${this.maxLength}`);
	}

	private applyColor(currentLength: number): void {
		currentLength > 255 || currentLength < 0
			? $(this.outputTarget).removeClass('text-white').addClass('text-red-600')
			: $(this.outputTarget).removeClass('text-red-600').addClass('text-white');
	}
}
