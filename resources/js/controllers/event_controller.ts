import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import RequestHandler from '../lib/RequestHandler';
import CustomSweetAlert from '../lib/CustomSweetAlert';
import Swal from 'sweetalert2';

import type { SweetAlertResult } from 'sweetalert2';
import type { AxiosResponse } from 'axios';

export default class extends Controller {
  static targets: string[] = ['tab', 'content'];
  static values = { activeTab: Number }

  declare readonly tabTargets: HTMLElement[];
  declare readonly contentTargets: HTMLElement[];
  declare activeTabValue: number;

  connect(): void {
    return this.updateTabDisplay();
  }

  changeTab(e: Event): void {
    const index: string | undefined = $(e.currentTarget as HTMLElement).attr('data-index');

    if (index) {
      this.activeTabValue = parseInt(index);
      this.updateTabDisplay();
    }
  }

  updateTabDisplay(): void {
    this.tabTargets.forEach((tab: HTMLElement, index: number): void => {
      const isActive: boolean = index === this.activeTabValue;

      if (isActive && $(tab).find('button').text() === 'Chat') {
        const chatEvent: CustomEvent<unknown> = new CustomEvent('chatTabSelected', { bubbles: true });

        tab.dispatchEvent(chatEvent);
      }

      $(tab).toggleClass('border-appYellow', isActive);
      $(tab).toggleClass('text-appYellow', isActive);
      $(tab).toggleClass('border-white', !isActive);
      $(tab).toggleClass('text-gray-500', !isActive);
    });

    this.contentTargets.forEach((content: HTMLElement, index: number) => {
      $(content).css('display', index === this.activeTabValue ? 'block' : 'none');
    });
  }

  async removeAttendee(e: Event) {
    e.preventDefault();

    const eventId: string = $(e.target as HTMLElement).attr('data-event') as string;
    const userId: string = $(e.target as HTMLElement).attr('data-index') as string;

    Swal.fire({
      icon: 'question',
      title: 'Confimation',
      text: 'Voulez vous vraiment supprimer cet utilisateur ?',
      showCancelButton: true,
      confirmButtonColor: '#ff0000',
      cancelButtonText: 'Annuler',
      confirmButtonText: 'Supprimer'
    }).then(async (result: SweetAlertResult<any>): Promise<SweetAlertResult<any> | undefined> => {
      if (result.isConfirmed) {
        try {
          const response: AxiosResponse<any, any> = await RequestHandler.delete(`/app/event/${eventId}/remove-attendee`, { userId });

          $(`[data-index="${userId}"]`).remove();

          return CustomSweetAlert.Toast.fire({
            icon: 'success',
            text: response.data.message
          });
        } catch (error: any) {
          return CustomSweetAlert.Toast.fire({
            icon: 'error',
            title: 'Erreur de saisie',
            html: RequestHandler.errorHandler(error.response.data.reasons)
          });
        }
      }
    });
  }

  copyJoinCode(e: Event): Promise<SweetAlertResult<any>> {
    navigator.clipboard.writeText($(e.target as HTMLElement).attr('data-code') as string);

    return CustomSweetAlert.Toast.fire({
      icon: 'success',
      title: 'Le code d\'invitation a bien été copié !'
    });
  }
}
