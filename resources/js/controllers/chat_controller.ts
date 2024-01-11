import { Controller } from '@hotwired/stimulus';
import { io, Socket } from 'socket.io-client';
import $ from 'jquery';

import CustomSweetAlert from '../lib/CustomSweetAlert';
import EventHelper from '../lib/EventHelper';

import type { MessagePackage } from '../interfaces/chatbox';
import type { SweetAlertResult } from 'sweetalert2';

export default class extends Controller {
	static targets: string[] = ['messages', 'input'];

	declare readonly messagesTarget: HTMLElement;
	declare readonly inputTarget: HTMLInputElement;

	declare currentUserId: number;

	private socket: Socket;
	private isConnected: boolean;

	public async connect(): Promise<void> {
		const token: string | null = localStorage.getItem('chatToken');

		this.currentUserId = Number($(this.element).attr('data-user') as string);
		$(this.element).removeAttr('data-user');

		this.socket = io({
			query: { token },
		});

		this.socket.emit('joinRoom', {
			room: EventHelper.getEventId(),
			token: localStorage.getItem('chatToken'),
		});
		this.socket.on('chat message', (msg: MessagePackage): void => this.addMessage(msg));
		this.socket.on('connect_error', () => {
			this.isConnected = false;
		});

		document.addEventListener('chatScroll', (): void => {
			this.messagesTarget.scrollTo(0, this.messagesTarget.scrollHeight);
		});
	}

	public sendMessage(
		e: Event
	): JQuery<HTMLInputElement> | Promise<SweetAlertResult<any>> | undefined {
		e.preventDefault();

		if (!localStorage.getItem('chatToken') || this.isConnected === false) {
			return CustomSweetAlert.Toast.fire({
				icon: 'error',
				title: "Erreur d'authenfication",
				text: 'Essayer de vous reconnecter !',
			});
		}

		const message: string = $(this.inputTarget).val()?.trim() as string;

		if (!message) {
			return;
		}

		this.socket.emit('chat message', {
			msg: message,
			eventId: EventHelper.getEventId(),
		});

		return $(this.inputTarget).val('');
	}

	private addMessage(msg: MessagePackage): void {
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
}
