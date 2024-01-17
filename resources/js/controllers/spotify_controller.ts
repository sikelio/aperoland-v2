import { Controller } from '@hotwired/stimulus';
import $ from 'jquery';
import TomSelect from 'tom-select';

import CustomSweetAlert from '../lib/CustomSweetAlert';
import RequestHandler from '../lib/RequestHandler';
import EventHelper from '../lib/EventHelper';
import { Track, CallbackTrack } from '../interfaces/track';

import type { AxiosResponse } from 'axios';
import { escape_html } from 'tom-select/dist/types/utils';
import type { TomOption, TomLoadCallback } from 'tom-select/dist/types/types';

export default class extends Controller {
  public static targets: string[] = [
    'playlistname',
    'songsearch',
    'songform',
    'audio',
    'playbtn',
    'timeline',
    'soundbtn',
    'playicon',
    'pauseicon',
    'volumeicon',
    'volumedownicon',
    'songlist'
  ];

  private tracks: Track[] = [];

  declare readonly playlistnameTarget: HTMLInputElement;
  declare readonly songsearchTarget: HTMLSelectElement;
  declare readonly songformTarget: HTMLFormElement;
  declare readonly songlistTarget: HTMLUListElement;

  declare readonly audioTargets: HTMLAudioElement[];
  declare readonly playbtnTargets: HTMLButtonElement[];
  declare readonly timelineTargets: HTMLInputElement[];
  declare readonly soundbtnTargets: HTMLButtonElement[];
  declare readonly playiconTargets: HTMLElement[];
  declare readonly pauseiconTargets: HTMLElement[];
  declare readonly volumeiconTargets: HTMLElement[];
  declare readonly volumedowniconTargets: HTMLElement[];

  public connect(): void {
    this.audioTargets.forEach((audio: HTMLAudioElement, index: number) => {
      audio.addEventListener('timeupdate', () => {
        this.timelineTargets[index].value = (audio.currentTime / audio.duration * 100).toString();
      });
    });

    $(this.audioTargets).each((index: number, audio: HTMLAudioElement) => {
      $(audio).on('timeupdate', () => {
        $(this.timelineTargets[index]).val(audio.currentTime / audio.duration * 100);
      });
    });

    if ($('[data-target="spotify.songsearch"]').length === 0) {
      return;
    }

    $(this.songsearchTarget).val('');

    new TomSelect(this.songsearchTarget, {
      valueField: 'uri',
      labelField: 'name',
      searchField: ['name', 'artists'],
      closeAfterSelect: true,
      load: async (query: string, callback: TomLoadCallback): Promise<void> => {
        var url: string = `/api/spotify/search-songs?q=${encodeURIComponent(query)}`;

        try {
          const response: AxiosResponse<any, any> = await RequestHandler.get(url);
          response.data.forEach((song) => {
            let artists: string[] = [];

            song.artists.forEach((artist) => {
              artists.push(artist.name);
            });

            song.artists = artists.join(', ');
          });

          callback(response.data, []);
        } catch (error: any) {
          callback([], []);
        }
      },
      onItemAdd: (value: string | number, item: HTMLDivElement): void => {
        this.tracks.push({
          title: $(item).find('#title').text(),
          artist: $(item).find('#artist').text(),
          previewUrl: $(item).find('#preview-url').text(),
          imageUrl: $(item).find('#image-url').text(),
          songId: value as string
        });
      },
      onItemRemove: (value: string | number): void => {
        this.tracks.filter((track: Track, index: number): void => {
          if (track.songId === value) {
            this.tracks.splice(index, 1);
          }
        });
      },
      render: {
        option: (item: TomOption, escape: typeof escape_html): string => {
          const albumImageLenght: number = item.album.images.length - 1;

          return `
            <div class="py-1">
              <div>
                <div class="flex items-center">
                  <img class="flex items-center" src="${escape(item.album.images[albumImageLenght].url)}" width="32"/>

                  <span class="ml-2 flex items-center flex-wrap">
                    ${escape(item.name)} - ${escape(item.artists)} - ${escape(item.album.name)}
                  </span>
                </div>
              </div>
            </div>
          `;
        },
        item: (item: TomOption, escape: typeof escape_html): string => {
          const albumImageLenght: number = item.album.images.length - 1;

          return `
            <div class="py-0">
              <div>
                <div class="flex items-center">
                  <img class="flex items-center" src="${escape(item.album.images[albumImageLenght].url)}" width="32"/>

                  <span class="ml-2 flex items-center flex-wrap text-white">
                    ${escape(item.name)} - ${escape(item.artists)} - ${escape(item.album.name)}
                  </span>

                  <span class="hidden" id="title">${escape(item.name)}</span>
                  <span class="hidden" id="artist">${escape(item.artists)}</span>
                  <span class="hidden" id="image-url">${item.album.images[0].url}</span>
                  <span class="hidden" id="preview-url">${item.preview_url}</span>
                </div>
              </div>
            </div>
          `;
        },
        no_results: (): string => {
          return `<div class="no-results">Pas de titres trouvés</div>`;
        },
      }
    });
  }

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

      CustomSweetAlert.Toast.fire({
        icon: 'success',
        title: response.data.message
      });

      location.reload();
    } catch (error: any) {
      return CustomSweetAlert.Toast.fire({
        icon: 'error',
        title: error.response.data.message || 'Une erreur s\'est produite'
      });
    }
  }

  public async addSong(e: Event) {
    e.preventDefault();

    if (this.tracks.length === 0) {
      return CustomSweetAlert.Toast.fire({
        icon: 'error',
        title: 'Veuillez selectionner au moins un titre à ajouter'
      });
    }

    const eventId = EventHelper.getEventIdByRegex();

    try {
      const response = await RequestHandler.post(`/api/spotify/event/${eventId}/add-song`, {
        songs: this.tracks
      });

      this.addSongToPage(response.data.songs);

      return CustomSweetAlert.Toast.fire({
        icon: 'success',
        title: response.data.message || 'Titre(s) ajouté avec succès'
      });
    } catch (error: any) {
      console.error(error);


      return CustomSweetAlert.Toast.fire({
        icon: 'error',
        title: error.response.data.message || 'Une erreur s\'est produite'
      });
    }
  }

  private addSongToPage(songs: CallbackTrack[]) {
    songs.forEach((song: CallbackTrack) => {
      const audioPlayer: HTMLAudioElement = document.createElement('audio');
      audioPlayer.src = this.escapeHTML(song.spotifyPreviewUrl);
      audioPlayer.setAttribute('data-target', 'spotify.audio');

      const previewContainer: HTMLDivElement = document.createElement('div');
      previewContainer.classList.add('p-4', 'flex', 'items-center', 'justify-center', 'border-t');

      if (song.spotifyPreviewUrl !== 'null') {
        const volumeOffIcon: HTMLElement = document.createElement('i');
        volumeOffIcon.classList.add('fa-solid', 'fa-volume-xmark', 'text-white', 'hidden');
        volumeOffIcon.setAttribute('data-target', 'spotify.pauseicon');

        const volumeIcon: HTMLElement = document.createElement('i');
        volumeIcon.classList.add('fa-solid', 'fa-volume-high', 'text-white');
        volumeIcon.setAttribute('data-target', 'spotify.pauseicon');

        const volumeButton: HTMLButtonElement = document.createElement('button');
        volumeButton.classList.add('sound-button');
        volumeButton.setAttribute('data-target', 'spotify.soundbtn');
        volumeButton.setAttribute('data-action', 'click->spotify#toggleVolume');
        volumeButton.appendChild(volumeIcon);
        volumeButton.appendChild(volumeOffIcon);

        const slider: HTMLInputElement = document.createElement('input');
        slider.classList.add('timeline');
        slider.setAttribute('type', 'range');
        slider.setAttribute('min', '0');
        slider.setAttribute('max', '100');
        slider.setAttribute('value', '0');
        slider.setAttribute('data-target', 'spotify.timeline');

        const pauseIcon: HTMLElement = document.createElement('i');
        pauseIcon.classList.add('fa-solid', 'fa-pause', 'text-white', 'hidden');
        pauseIcon.setAttribute('data-target', 'spotify.pauseicon');

        const playIcon: HTMLElement = document.createElement('i');
        playIcon.classList.add('fa-solid', 'fa-play', 'text-white');
        playIcon.setAttribute('data-target', 'spotify.playicon');

        const playButton: HTMLButtonElement = document.createElement('button');
        playButton.classList.add('player-button');
        playButton.setAttribute('data-target', 'spotify.playbtn');
        playButton.setAttribute('data-action', 'click->spotify#toggleAudio');
        playButton.appendChild(pauseIcon);
        playButton.appendChild(playIcon);

        const controlsContainer: HTMLDivElement = document.createElement('div');
        controlsContainer.classList.add('controls');
        controlsContainer.appendChild(playButton);
        controlsContainer.appendChild(slider);
        controlsContainer.appendChild(volumeButton);

        const audioContainer: HTMLDivElement = document.createElement('div');
        audioContainer.classList.add('audio-player', 'w-full');
        audioContainer.appendChild(audioPlayer);
        audioContainer.appendChild(controlsContainer);

        previewContainer.appendChild(audioContainer);
      } else {
        const noPreviewSpan: HTMLSpanElement = document.createElement('span');
        noPreviewSpan.classList.add('text-white');
        noPreviewSpan.textContent = 'Pas de preview possible';

        previewContainer.appendChild(noPreviewSpan);
      }

      const artistText: HTMLParagraphElement = document.createElement('p');
      artistText.classList.add('text-white', 'text-sm');
      artistText.textContent = this.escapeHTML(song.artist);

      const titleHeader: HTMLHeadElement = document.createElement('h4');
      titleHeader.classList.add('text-white', 'font-semibold');
      titleHeader.textContent = this.escapeHTML(song.title);

      const titleContainer: HTMLDivElement = document.createElement('div');
      titleContainer.classList.add('ml-2', 'flex', 'flex-col', 'justify-center');
      titleContainer.appendChild(titleHeader);
      titleContainer.appendChild(artistText);

      const albumCover: HTMLImageElement = document.createElement('img');
      albumCover.setAttribute('src', this.escapeHTML(song.spotifyImageUrl));
      albumCover.setAttribute('width', '64');

      const songInfoContainer: HTMLDivElement = document.createElement('div');
      songInfoContainer.classList.add('flex');
      songInfoContainer.appendChild(albumCover);
      songInfoContainer.appendChild(titleContainer);

      const upperContainer: HTMLDivElement = document.createElement('div');
      upperContainer.classList.add('flex', 'items-start', 'justify-between', 'p-4');
      upperContainer.appendChild(songInfoContainer);

      // GOOD
      const cardContainer: HTMLLIElement = document.createElement('li');
      cardContainer.classList.add('border', 'rounded-lg');
      cardContainer.appendChild(upperContainer);
      cardContainer.appendChild(previewContainer);

      this.songlistTarget.appendChild(cardContainer);

      if (song.spotifyPreviewUrl !== 'null') {
        const index = this.audioTargets.indexOf(audioPlayer);

        audioPlayer.addEventListener('timeupdate', () => {
          this.timelineTargets[index].value = (audioPlayer.currentTime / audioPlayer.duration * 100).toString();
        });
      }
    });
  }

  public toggleAudio(e: Event): void {
    const index: number = this.playbtnTargets.indexOf(e.currentTarget as HTMLButtonElement);
    const audio: HTMLAudioElement = this.audioTargets[index];

    console.log(this.playiconTargets);
    console.log(index);


    if (audio.paused) {
      audio.play();

      this.playiconTargets[index].classList.toggle('hidden');
      this.pauseiconTargets[index].classList.toggle('hidden');
    } else {
      audio.pause();

      this.playiconTargets[index].classList.toggle('hidden');
      this.pauseiconTargets[index].classList.toggle('hidden');
    }
  }

  public toggleVolume(e: Event): void {
    const index: number = this.soundbtnTargets.indexOf(e.currentTarget as HTMLButtonElement);
    const audio: HTMLAudioElement = this.audioTargets[index];

    audio.muted = !audio.muted;
    this.volumeiconTargets[index].classList.toggle('hidden');
    this.volumedowniconTargets[index].classList.toggle('hidden');
  }

  private escapeHTML(str: string | string[]): string {
		const div: JQuery<HTMLElement> = $('<div>').append(document.createTextNode(str as string));

		return $(div).html();
	}
}
