import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import Swal from 'sweetalert2';
import RequestHandler from '../lib/RequestHandler';
import CustomSweetAlert from '../lib/CustomSweetAlert';

export default class extends Controller {
  async handleNewEvent(e: any) {
    e.preventDefault();

    const eventName = $(e.target).find('[name="eventName"]').val();
    const description = $(e.target).find('[name="description"]').val();
    const startDateTime = $(e.target).find('[name="startDateTime"]').val();
    const endDateTime = $(e.target).find('[name="endDateTime"]').val();

    try {
      const response = await RequestHandler.post('/app/add-event', {
        eventName,
        description,
        startDateTime,
        endDateTime,
      });

      location.href = `/app/event/${response.data.event.id}`;
    } catch (error: any) {
      Swal.fire({
        title: error.response.data.message,
        html: RequestHandler.errorHandler(error.response.data.reasons),
        icon: 'error',
      });
    }
  }

  copyJoinCode(e: any) {
    navigator.clipboard.writeText($(e.target).text());

    CustomSweetAlert.Toast.fire({
      icon: 'success',
      title: 'Le code d\'invitation a bien été copié !'
    });
  }

  joinEvent(e: any) {
    e.preventDefault();
  }
}
