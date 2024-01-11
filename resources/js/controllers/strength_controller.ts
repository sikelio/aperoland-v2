import { Controller } from '@hotwired/stimulus';
import zxcvbn from 'zxcvbn';
import $ from 'jquery';

import type { ZXCVBNScore } from 'zxcvbn';

export default class extends Controller {
  static targets = ['password', 'strengthBar'];

  declare readonly passwordTarget: HTMLInputElement;
  declare readonly strengthBarTargets: HTMLElement[];

  public checkStrength(): void {
    const passwordValue: string = $(this.passwordTarget).val() as string;
    const score = passwordValue ? zxcvbn(passwordValue).score : 0;

    if (passwordValue.length > 0) {
      this.updatePasswordScore(score);
    } else {
      this.reset();
    }
  }

  public updatePasswordScore(score: ZXCVBNScore) {
    this.reset();

    let color: string = score < 2 ? 'bg-red-400' : (score < 4 ? 'bg-yellow-400' : 'bg-green-500');

    for (let i = 0; i <= score; i++) {
      $(this.strengthBarTargets[i]).addClass(color);
    }
  }

  public reset() {
    $(this.strengthBarTargets)
      .removeClass('bg-red-400')
      .removeClass('bg-yellow-400')
      .removeClass('bg-green-500')
      .addClass('bg-gray-200');
  }
}
