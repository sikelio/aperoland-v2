import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';

import CustomSweetAlert from '../lib/CustomSweetAlert';
import RequestHandler from '../lib/RequestHandler';
import EventHelper from '../lib/EventHelper';

import type { AxiosResponse } from 'axios';

export default class extends Controller {
  public static targets: string[] = ['playlistname'];

  declare readonly playlistnameTarget: HTMLInputElement;

  public connect(): void {}

  public async createPlaylist(e: Event) {
    e.preventDefault();

    const playlistName = $(this.playlistnameTarget).val();

    if (!playlistName) {
      return CustomSweetAlert.Toast.fire({
        icon: 'error',
        title: 'Erreur de saisie',
        text: 'Veuillez renseignez un nom de playlist'
      });
    }

    try {
      const response: AxiosResponse<any, any> = await RequestHandler.post(`/api/spotify/event/${EventHelper.getEventIdByRegex()}/create-playlist`, {
        playlistName: playlistName
      });

      return CustomSweetAlert.Toast.fire({
        icon: 'error',
        title: response.data.message
      });
    } catch (error: any) {
      return CustomSweetAlert.Toast.fire({
        icon: 'error',
        title: error.response.data.message || 'Une erreur s\'est produite'
      });
    }
  }
}
