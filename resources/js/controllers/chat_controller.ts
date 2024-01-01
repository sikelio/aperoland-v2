import { Controller } from '@hotwired/stimulus';
import { io, Socket } from 'socket.io-client';
import $ from 'jquery';

export default class extends Controller {
  static targets = ['messages', 'input'];

  declare readonly messagesTarget: HTMLElement;
  declare readonly inputTarget: HTMLInputElement;

  declare currentUserId: string;

  private socket: Socket;

  public async connect() {
    const token = localStorage.getItem('chatToken');

    this.currentUserId = $(this.element).attr('data-user') as string;
    $(this.element).removeAttr('data-user');

    this.socket = io({
      query: { token }
    });

    this.socket.emit('joinRoom', { room: this.getEventId(), token: localStorage.getItem('chatToken') });
    this.socket.on('chat message', (msg) => this.addMessage(msg));

    document.addEventListener('chatTabSelected', () => {
      this.messagesTarget.scrollTo(0, this.messagesTarget.scrollHeight);
    });
  }

  public sendMessage(e: Event) {
    e.preventDefault();

    const message = $(this.inputTarget).val()?.trim();

    if (!message) {
      return;
    }

    this.socket.emit('chat message', {
      msg: message,
      eventId: this.getEventId()
    });

    $(this.inputTarget).val('');
  }

  private addMessage(msg) {
    const isAuthor = msg.authorUserId == this.currentUserId;

    const item = $('<div>').addClass(`mb-2 ${isAuthor ? 'text-right': ''}`);

    const usernameSpan = $('<span>')
      .addClass('text-sm text-white')
      .text(msg.username);

    const usernameDiv = $('<div>')
      .addClass(isAuthor ? 'text-right' : 'text-left')
      .append(usernameSpan);

    const messageContent = $('<p>')
      .addClass(`${isAuthor ? 'bg-appYellow' : 'bg-gray-200'} ${isAuthor ? 'text-white' : 'text-gray-700'} rounded-lg py-2 px-4 inline-block`)
      .text(this.escapeHTML(msg.message));

    item.append(usernameDiv, messageContent);
    $(this.messagesTarget).append(item);

    this.messagesTarget.scrollTo(0, this.messagesTarget.scrollHeight);
  }

  private escapeHTML(str: string) {
    const div = document.createElement('div');

    $(div).append(document.createTextNode(str));

    return $(div).html();
  }

  private getEventId(): string {
    const currentUrl = window.location.pathname;
    const segments = currentUrl.split('/');
    const eventId = segments.pop() || segments.pop();

    return eventId as string;
  }
}
