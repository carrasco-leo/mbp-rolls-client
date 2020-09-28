//
// socket.ts — mbp-rolls-client
// ~/src/app/stream
//

import { Subject, Observable } from 'rxjs';

import { SocketEvent } from './events';

export abstract class Socket {
	private $events = new Subject<SocketEvent>();
	private $socket: WebSocket;

	get events() { return this.$events.asObservable(); }

	state: 'close'|'pending'|'open' = 'close';

	constructor(
		readonly secured?: boolean,
		readonly protocols?: string|string[],
	) {}

	connect(host: string, port: number): Promise<void> {
		if (this.state === 'open') {
			return Promise.reject(new Error('Already connected to a server'));
		} else if (this.state === 'pending') {
			return Promise.reject(new Error('Connecting to a server'));
		}

		return new Promise((resolve, reject) => {
			try {
				this.state = 'pending';
				this.$socket = this._createSocket(host, port);
				this._messageListener();
				this._openListener();
				this._closeListener();
			} catch (error) {
				return reject(error);
			}
		});
	}

	disconnect(): void {
		if (this.state === 'close') {
			return;
		}

		this.state = 'close';
		this.$socket.close();
		this.$socket = null;
	}

	write(data: any): void {
		this.$socket.send(JSON.stringify(data));
	}

	protected _createSocket(host: string, port: number) {
		const protocol = (this.secured) ? 'wss' : 'ws';
		return new WebSocket(protocol+'://' + host + ':' + port, this.protocols);
	}

	protected _messageListener() {
		this.$socket.addEventListener('message', (event) => {
			try {
				const data = JSON.parse(event.data);
				this.$events.next({ type: 'message', data });
			} catch (error) {
				this.$events.next({
					type: 'error',
					reason: error.message,
				});
			}
		});
	}

	protected _openListener() {
		this.$socket.addEventListener('open', () => {
			this.state = 'open';
			this.$events.next({ type: 'open' });
		});
	}

	protected _closeListener() {
		this.$socket.addEventListener('close', (event) => {
			this.$events.next({
				type: 'close',
				code: event.code,
				reason: event.reason,
				wasClean: event.wasClean,
			});
		});
	}
}
