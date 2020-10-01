//
// stream.service.ts — mbp-rolls-client
// ~/src/app/stream
//

import {
	Inject,
	Injectable,
	Optional,
	InjectionToken,
} from '@angular/core';

import { Subject } from 'rxjs';
import { first, filter, map } from 'rxjs/operators';

import { Socket } from './socket';
import { StreamEvent, StreamWelcomeEvent, SocketMessageEvent } from './events';
import { HistoryEvent, HistoryRollEvent } from './history-event';

export const STREAM_SECURED = new InjectionToken<boolean>('stream.secured');
export const STREAM_PROTOCOLS = new InjectionToken<string|string[]>('stream.protocols');

@Injectable({ providedIn: 'root' })
export class StreamService extends Socket {
	private $streamEvents = new Subject<StreamEvent>();
	private $deletion = new Subject<HistoryRollEvent>();
	private $edition = new Subject<HistoryRollEvent>();
	private $addition = new Subject<HistoryEvent>();
	private $rolls = new Map<string, HistoryRollEvent>();

	private socketSubscription = this.events.subscribe((event) => {
		if (event.type === 'message') {
			this._handleMessage(event.data)
		} else if (event.type === 'close') {
			this.isConnected = false;

			if (!event.wasClean) {
				const error = this._createCloseError(event.code, event.reason);
				this.$streamEvents.next({ type: 'error', reason: error.message });
			}
		} else if (event.type === 'error') {
			if (this.state === 'open') {
				this.$streamEvents.next(event);
			}
		}
	});

	get streamEvents() { return this.$streamEvents.asObservable(); }
	get addition() { return this.$addition.asObservable(); }
	get edition() { return this.$edition.asObservable(); }
	get deletion() { return this.$deletion.asObservable(); }

	isConnected: boolean = false;
	users: { [key: string]: string; } = {};
	id: string = null;
	username: string = null;

	constructor(
		@Optional() @Inject(STREAM_SECURED) secured: boolean,
		@Optional() @Inject(STREAM_PROTOCOLS) protocols: string|string[],
	) { super(secured || false, protocols || null); }

	connectWithUsername(username: string, address: string): Promise<void> {
		const waitFor = this.streamEvents
			.pipe(first((event) => event.type === 'welcome' || event.type === 'error'))
			.toPromise()
			.then((event) => {
				if (event.type === 'error') {
					this.disconnect();

					throw new Error(event.reason);
				}

				return event as StreamWelcomeEvent;
			})

		return this.connect(address)
			.then(() => this.write({ type: 'rename', value: username }))
			.then(() => waitFor)
			.then((event) => {
				this.isConnected = true;
				this.users = { ...event.users };
				this.id = event.id;
				this.username = username;
			})
	}

	disconnect(): void {
		super.disconnect();

		this.isConnected = false;
		this.users = {};
		this.id = null;
		this.username = null;
	}

	protected _handleMessage(event: StreamEvent) {
		switch (event.type) {
			case 'welcome': break;

			case 'connection':
				this.$addition.next({
					...event,
					date: new Date().toISOString(),
				});
				this.users[event.id] = event.username;
				break;

			case 'disconnection':
				this.$addition.next({
					...event,
					username: this.users[event.id],
					date: new Date().toISOString(),
				});
				delete this.users[event.id];
				break;

			case 'error':
				break;
		}

		this.$streamEvents.next(event);
	}
}
