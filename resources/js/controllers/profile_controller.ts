import { Controller } from '@hotwired/stimulus';
import Swal from 'sweetalert2';
import $ from 'jquery';

import RequestHandler from '../lib/RequestHandler';

import type { SweetAlertResult } from 'sweetalert2';
import CustomSweetAlert from '../lib/CustomSweetAlert';

export default class extends Controller {
  public updateUsernameMail(e: Event): void {
    e.preventDefault();
  }

  public async updatePassword(e: Event): Promise<SweetAlertResult<any>> {
    e.preventDefault();

    const password = $(e.currentTarget as HTMLElement).find('[name="password"]').val();
    const newPassword = $(e.currentTarget as HTMLElement).find('[name="newPassword"]').val();
    const confirmNewPassword = $(e.currentTarget as HTMLElement).find('[name="confirmNewPassword"]').val();

    if (newPassword !== confirmNewPassword) {
      return CustomSweetAlert.Toast.fire({
        icon: 'error',
        title: 'Erreur de saisie',
        text: 'Les nouveaux mots de passe ne correspondent pas'
      });
    }

    try {
      await RequestHandler.patch('/profile/me/change-password', { password, newPassword, confirmNewPassword });

      $(e.currentTarget as HTMLElement).find('[name="password"]').val('');
      $(e.currentTarget as HTMLElement).find('[name="newPassword"]').val('');
      $(e.currentTarget as HTMLElement).find('[name="confirmNewPassword"]').val('');

      return CustomSweetAlert.Toast.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Votre mot de passe à bien été changé'
      });
    } catch (error: any) {
      return CustomSweetAlert.Toast.fire({
        icon: 'error',
        title: 'Erreur inattendue',
        text: 'Quelque chose s\'est mal déroulé'
      });
    }
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
