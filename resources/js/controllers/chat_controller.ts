import { Controller } from '@hotwired/stimulus';
import { io, Socket } from 'socket.io-client';
import $ from 'jquery';

export default class extends Controller {
  static targets = ['messages', 'input'];

  declare readonly messagesTarget: HTMLElement;
  declare readonly inputTarget: HTMLInputElement;

  private socket: Socket;

  public async connect() {
    const token = localStorage.getItem('chatToken');

    this.socket = io({
      query: { token }
    });

    this.socket.emit('joinRoom', { room: this.getEventId(), token: localStorage.getItem('chatToken') });
    this.socket.on('chat message', (msg) => this.addMessage(msg));
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
    const item = document.createElement('li');

    $(item).text(`le ${this.escapeHTML(msg.date)} à ${this.escapeHTML(msg.time)} : ${this.escapeHTML(msg.username)} : ${this.escapeHTML(msg.msg)}`);
    $(this.messagesTarget).prepend(item);

    window.scrollTo(0, document.body.scrollHeight);
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
