import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import Swal from 'sweetalert2';

import RequestHandler from '../lib/RequestHandler';
import CustomSweetAlert from '../lib/CustomSweetAlert';
import EventHelper from '../lib/EventHelper';

import type { SweetAlertResult } from 'sweetalert2';
import type { AxiosResponse } from 'axios';

export default class extends Controller {
	static targets: string[] = ['tab', 'content', 'code'];
	static values = { activeTab: Number };

  declare readonly codeTarget: HTMLElement;

	declare readonly tabTargets: HTMLElement[];
	declare readonly contentTargets: HTMLElement[];

	declare activeTabValue: number;
	declare mapEvent: CustomEvent<unknown>;
	declare chatEvent: CustomEvent<unknown>;

	public connect(): void {
		this.mapEvent = new CustomEvent('mapReload');
    this.chatEvent = new CustomEvent('chatScroll');

		this.updateTabDisplay();
	}

	public changeTab(e: Event): void {
		const index: string | undefined = $(e.currentTarget as HTMLElement).attr('data-index');

		if (index) {
			this.activeTabValue = parseInt(index);
			this.updateTabDisplay();
		}

    switch (index) {
      case '2':
        document.dispatchEvent(this.chatEvent);
        break;
      case '3':
        document.dispatchEvent(this.mapEvent);
        break;
    }
	}

	public updateTabDisplay(): void {
		this.tabTargets.forEach((tab: HTMLElement, index: number): void => {
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

	public async removeAttendee(e: Event): Promise<void> {
		e.preventDefault();

		const eventId: string = EventHelper.getEventId();
		const userId: string = $(e.target as HTMLElement).attr('data-index') as string;

		Swal.fire({
			icon: 'question',
			title: 'Confimation',
			text: 'Voulez vous vraiment supprimer cet utilisateur ?',
			showCancelButton: true,
			confirmButtonColor: '#ff0000',
			cancelButtonText: 'Annuler',
			confirmButtonText: 'Supprimer',
		}).then(async (result: SweetAlertResult<any>): Promise<SweetAlertResult<any> | undefined> => {
			if (result.isConfirmed) {
				try {
					const response: AxiosResponse<any, any> = await RequestHandler.delete(
						`/app/event/${eventId}/remove-attendee`,
						{ userId }
					);

					$(`[data-index="${userId}"]`).remove();

					return CustomSweetAlert.Toast.fire({
						icon: 'success',
						text: response.data.message,
					});
				} catch (error: any) {
					return CustomSweetAlert.Toast.fire({
						icon: 'error',
						title: 'Erreur de saisie',
						html: RequestHandler.errorHandler(error.response.data.reasons),
					});
				}
			}
		});
	}

	public copyJoinCode(e: Event): Promise<SweetAlertResult<any>> {
		navigator.clipboard.writeText($(e.target as HTMLElement).attr('data-code') as string);

		return CustomSweetAlert.Toast.fire({
			icon: 'success',
			title: "Le code d'invitation a bien été copié !",
		});
	}

  public async deleteEvent(e: Event): Promise<void> {
    e.preventDefault();

    Swal.fire({
      icon: 'question',
			title: 'Confimation',
			text: 'Voulez vous vraiment supprimer L\'apéro ?',
			showCancelButton: true,
			confirmButtonColor: '#ff0000',
			cancelButtonText: 'Annuler',
			confirmButtonText: 'Supprimer',
    }).then(async (result: SweetAlertResult<any>): Promise<SweetAlertResult<any> | "/app/home" | undefined> => {
      if (result.isConfirmed) {
        const eventId: string = EventHelper.getEventId();

        try {
					await RequestHandler.delete(`/app/event/${eventId}/delete`);

					return location.href = '/app/home';
				} catch (error: any) {
					return CustomSweetAlert.Toast.fire({
						icon: 'error',
						title: 'Erreur de saisie',
						html: RequestHandler.errorHandler(error.response.data.reasons),
					});
				}
      }
    });
  }

  public async changeCode(e: Event) {
    e.preventDefault();

    const eventId: string = EventHelper.getEventIdByRegex();

    try {
      const response = await RequestHandler.put(`/app/event/${eventId}/edit/code`);

      $(this.codeTarget).attr('data-code', response.data.code);

      return CustomSweetAlert.Toast.fire({
        icon: 'success',
        text: 'Le code d\'invitation à bien été modifié'
      });
    } catch (error: any) {
      return CustomSweetAlert.Toast.fire({
        icon: 'error',
        title: error.response.data.message
      });
    }
  }

  public async leaveEvent(e: Event): Promise<SweetAlertResult<any> | string> {
    e.preventDefault();

    const eventId: string = EventHelper.getEventIdByRegex();

    try {
      await RequestHandler.post(`/app/event/${eventId}/leave`);

      return location.href = '/app/home';
    } catch (error: any) {
      return CustomSweetAlert.Toast.fire({
        icon: 'error',
        title: error.response.data.message || 'Erreur'
      });
    }
  }
}
