import { Controller } from '@hotwired/stimulus';
import Swal from 'sweetalert2';

import RequestHandler from '../lib/RequestHandler';

import type { SweetAlertResult } from 'sweetalert2';
import CustomSweetAlert from '../lib/CustomSweetAlert';

export default class extends Controller {
  public updateUsernameMail(e: Event) {
    e.preventDefault();
  }

  public updatePassword(e: Event) {
    e.preventDefault();
  }

  public async deleteAccount(e: Event): Promise<SweetAlertResult<any> | "/" | undefined> {
    e.preventDefault();

    let confirmation: SweetAlertResult<any> = await Swal.fire({
      icon: 'warning',
      title: 'Confirmation de suppression',
      text: 'Êtes vous sur de vouloir supprimer votre compte ? Cette action est irréversible !',
      showCancelButton: true,
			confirmButtonColor: '#ff0000',
			cancelButtonText: 'Annuler',
			confirmButtonText: 'Supprimer mon compte',
    });

    if (confirmation.isConfirmed === true) {
      try {
        await RequestHandler.post('/profile/me/delete');

        localStorage.removeItem('chatToken');

        return location.href = '/';
      } catch (error: any) {
        return CustomSweetAlert.Toast.fire({
          icon: 'error',
          title: 'Erreur inattendue',
          text: 'Quelque chose s\'est mal déroulé'
        });
      }
    }
  }
}
