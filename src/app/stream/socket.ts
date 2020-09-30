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

	connect(address: string): Promise<void> {
		if (this.state === 'open') {
			return Promise.reject(new Error('Already connected to a server'));
		} else if (this.state === 'pending') {
			return Promise.reject(new Error('Connecting to a server'));
		}

		return new Promise((resolve, reject) => {
			try {
				this.$socket = this._createSocket(address);
				this.state = 'pending';
				this._messageListener();
				this._openListener(resolve);
				this._closeListener(reject);
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

	protected _createSocket(address: string) {
		const protocol = (this.secured) ? 'wss' : 'ws';
		const url = protocol+'://' + address;

		return new WebSocket(url, this.protocols);
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

	protected _openListener(resolve: () => void) {
		this.$socket.addEventListener('open', () => {
			this.state = 'open';
			this.$events.next({ type: 'open' });
			resolve();
		});
	}

	protected _closeListener(reject: (error: any) => void) {
		this.$socket.addEventListener('close', (event) => {
			if (this.state === 'pending') {
				reject(this._createCloseError(event));
			} else {
				this.$events.next({
					type: 'close',
					code: event.code,
					reason: event.reason,
					wasClean: event.wasClean,
				});
			}

			this.state = 'close';
			this.$socket = null;
		});
	}

	protected _createCloseError(event: CloseEvent) {
		if (event.reason) {
			return new Error(event.reason);
		}

		switch (event.code) {
			case 1006:
				return new Error((this.state === 'pending')
					? 'Unable to connect to server'
					: 'Connection aborted'
				)

			default:
				return new Error('unknown socket error');
		}
	}
}
