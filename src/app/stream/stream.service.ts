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
import { StreamEvent, SocketMessageEvent } from './events';

export const STREAM_SECURED = new InjectionToken<boolean>('stream.secured');
export const STREAM_PROTOCOLS = new InjectionToken<string|string[]>('stream.protocols');

@Injectable({ providedIn: 'root' })
export class StreamService extends Socket {
	private $streamEvents = new Subject<StreamEvent>();
	private socketSubscription = this.events
		.pipe(filter<SocketMessageEvent<StreamEvent>>((event) => {
			return event.type === 'message';
		}))
		.subscribe((event) => this.$streamEvents.next(event.data));

	get streamEvents() { return this.$streamEvents.asObservable(); }

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
					throw new Error(event.reason);
				}

				return event;
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
}
