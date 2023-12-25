import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import Swal from 'sweetalert2';
import RequestHandler from '../lib/RequestHandler';

export default class extends Controller {
	async handleNewEvent(e) {
		e.preventDefault();

		const eventName = $(e.target).find('[name="eventName"]').val();
		const description = $(e.target).find('[name="description"]').val();
		const startDateTime = $(e.target).find('[name="startDateTime"]').val();
		const endDateTime = $(e.target).find('[name="endDateTime"]').val();

		try {
			await RequestHandler.post('/app/add-event', {
				eventName,
				description,
				startDateTime,
				endDateTime
			});
		} catch (error) {
			Swal.fire({
				title: error.response.data.message,
				html: RequestHandler.errorHandler(error.response.data.reasons),
				icon: 'error',
			});
		}
	}
}