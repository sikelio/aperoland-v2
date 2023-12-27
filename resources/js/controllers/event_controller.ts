import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';

export default class extends Controller {
  static targets: string[] = ['tab', 'content'];
  static values = { activeTab: Number }

  declare readonly tabTargets: HTMLElement[];
  declare readonly contentTargets: HTMLElement[];
  declare activeTabValue: number;

  connect(): void {
    this.updateTabDisplay();
  }

  changeTab(event: Event): void {
    const index = $(event.currentTarget as HTMLElement).attr('data-index');

    if (index) {
      this.activeTabValue = parseInt(index);
      this.updateTabDisplay();
    }
  }

  updateTabDisplay(): void {
    this.tabTargets.forEach((tab: HTMLElement, index: number) => {
      const isActive: boolean = index === this.activeTabValue;

      $(tab).toggleClass('border-appYellow', isActive);
      $(tab).toggleClass('text-appYellow', isActive);
      $(tab).toggleClass('border-white', !isActive);
      $(tab).toggleClass('text-gray-500', !isActive);
    });

    this.contentTargets.forEach((content: HTMLElement, index: number) => {
      $(content).css('display', index === this.activeTabValue ? 'block' : 'none');
    });
  }
}
