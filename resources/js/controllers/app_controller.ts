import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import Swal from 'sweetalert2';
import RequestHandler from '../lib/RequestHandler';
import CustomSweetAlert from '../lib/CustomSweetAlert';

import type { AxiosResponse } from 'axios';
import type { SweetAlertResult } from 'sweetalert2';
import EventHelper from '../lib/EventHelper';

export default class extends Controller {
	async handleNewEvent(e: Event): Promise<string | SweetAlertResult<any>> {
		e.preventDefault();

		const eventName: string = $(e.currentTarget as HTMLElement)
			.find('[name="eventName"]')
			.val() as string;
		const description: string = $(e.currentTarget as HTMLElement)
			.find('[name="description"]')
			.val() as string;
		const startDateTime: string = $(e.currentTarget as HTMLElement)
			.find('[name="startDateTime"]')
			.val() as string;
		const endDateTime: string = $(e.currentTarget as HTMLElement)
			.find('[name="endDateTime"]')
			.val() as string;
		const address: string = $(e.currentTarget as HTMLElement)
			.find('[name="address"]')
			.val() as string;
		const lat: number = Number(
			$(e.currentTarget as HTMLElement)
				.find('#lat')
				.text()
		);
		const long: number = Number(
			$(e.currentTarget as HTMLElement)
				.find('#long')
				.text()
		);

		try {
			const response: AxiosResponse<any, any> = await RequestHandler.post('/app/add-event', {
				eventName,
				description,
				startDateTime,
				endDateTime,
				address: address === '' ? null : address,
				lat: address === '' ? null : (isNaN(lat) ? null : lat),
				long: address === '' ? null : (isNaN(long) ? null : long),
			});

			return (location.href = `/app/event/${response.data.event.id}`);
		} catch (error: any) {
			return Swal.fire({
				title: error.response.data.message,
				html: RequestHandler.errorHandler(error.response.data.reasons),
				icon: 'error',
			});
		}
	}

  async handleEditEvent(e: Event) {
    e.preventDefault();

    const eventName: string = $(e.currentTarget as HTMLElement)
			.find('[name="eventName"]')
			.val() as string;
		const description: string = $(e.currentTarget as HTMLElement)
			.find('[name="description"]')
			.val() as string;
		const startDateTime: string = $(e.currentTarget as HTMLElement)
			.find('[name="startDateTime"]')
			.val() as string;
		const endDateTime: string = $(e.currentTarget as HTMLElement)
			.find('[name="endDateTime"]')
			.val() as string;
		const address: string = $(e.currentTarget as HTMLElement)
			.find('[name="address"]')
			.val() as string;
		const lat: number = Number(
			$(e.currentTarget as HTMLElement)
				.find('#lat')
				.text()
		);
		const long: number = Number(
			$(e.currentTarget as HTMLElement)
				.find('#long')
				.text()
		);

    const eventId = EventHelper.getEventIdByRegex();

    try {
			const response: AxiosResponse<any, any> = await RequestHandler.put(`/app/event/${eventId}/edit`, {
				eventName,
				description,
				startDateTime,
				endDateTime,
				address: address === '' ? null : address,
				lat: address === '' ? null : (isNaN(lat) ? null : lat),
				long: address === '' ? null : (isNaN(long) ? null : long),
			});

			return (location.href = `/app/event/${response.data.event.id}`);
		} catch (error: any) {
			return CustomSweetAlert.Toast.fire({
				title: error.response.data.message,
				html: error.response.data.reasons ? RequestHandler.errorHandler(error.response.data.reasons) : '',
				icon: 'error',
			});
		}
  }

	copyJoinCode(e: Event): Promise<SweetAlertResult<any>> {
		navigator.clipboard.writeText($(e.currentTarget as HTMLElement).text());

		return CustomSweetAlert.Toast.fire({
			icon: 'success',
			title: "Le code d'invitation a bien été copié !",
		});
	}

	async joinEvent(e: Event): Promise<SweetAlertResult<any> | '/app/home'> {
		e.preventDefault();

		const joinCode: string = $(e.currentTarget as HTMLElement)
			.find('[name="joinCode"]')
			.val() as string;

		try {
			await RequestHandler.post('/app/join-event', { joinCode });

			CustomSweetAlert.Toast.fire({
				icon: 'success',
				text: 'Code valide',
			});

			return (location.href = '/app/home');
		} catch (error: any) {
			return CustomSweetAlert.Toast.fire({
				icon: 'error',
				title: error.response.data.message,
				html: RequestHandler.errorHandler(error.response.data.reasons),
			});
		}
	}
}
