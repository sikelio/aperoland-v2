import { Controller } from '@hotwired/stimulus';
import { io, Socket } from 'socket.io-client';
import $ from 'jquery';

import type { MessagePackage } from '../interfaces/chatbox';

export default class extends Controller {
  static targets: string[] = ['messages', 'input'];

  declare readonly messagesTarget: HTMLElement;
  declare readonly inputTarget: HTMLInputElement;

  declare currentUserId: number;

  private socket: Socket;

  public async connect() {
    const token: string | null = localStorage.getItem('chatToken');

    this.currentUserId = Number($(this.element).attr('data-user') as string);
    $(this.element).removeAttr('data-user');

    this.socket = io({
      query: { token },
    });

    this.socket.emit('joinRoom', {
      room: this.getEventId(),
      token: localStorage.getItem('chatToken'),
    });
    this.socket.on('chat message', (msg: MessagePackage): void => this.addMessage(msg));

    document.addEventListener('chatTabSelected', (): void => {
      this.messagesTarget.scrollTo(0, this.messagesTarget.scrollHeight);
    });
  }

  public sendMessage(e: Event): JQuery<HTMLInputElement> | undefined {
    e.preventDefault();

    const message: string = $(this.inputTarget).val()?.trim() as string;

    if (!message) {
      return;
    }

    this.socket.emit('chat message', {
      msg: message,
      eventId: this.getEventId(),
    });

    return $(this.inputTarget).val('');
  }

  private addMessage(msg: MessagePackage) {
    const isAuthor: boolean = msg.authorUserId == this.currentUserId;

    const item: JQuery<HTMLElement> = $('<div>').addClass(`mb-2 ${isAuthor ? 'text-right' : ''}`);

    const usernameSpan: JQuery<HTMLElement> = $('<span>')
      .addClass('text-sm text-white')
      .text(msg.username);

    const usernameDiv: JQuery<HTMLElement> = $('<div>')
      .addClass(isAuthor ? 'text-right' : 'text-left')
      .append(usernameSpan);

    const messageContent: JQuery<HTMLElement> = $('<p>')
      .addClass(
        `${isAuthor ? 'bg-appYellow' : 'bg-gray-200'} ${
          isAuthor ? 'text-white' : 'text-gray-700'
        } rounded-lg py-2 px-4 inline-block`
      )
      .text(this.escapeHTML(msg.message));

    item.append(usernameDiv, messageContent);
    $(this.messagesTarget).append(item);

    this.messagesTarget.scrollTo(0, this.messagesTarget.scrollHeight);
  }

  private escapeHTML(str: string | string[]): string {
    const div: JQuery<HTMLElement> = $('<div>').append(document.createTextNode(str as string));

    return $(div).html();
  }

  private getEventId(): string {
    const currentUrl: string = window.location.pathname;
    const segments: string[] = currentUrl.split('/');
    const eventId: string | undefined = segments.pop() || segments.pop();

    return eventId as string;
  }
}
