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

import { Socket } from './socket';

export const STREAM_SECURED = new InjectionToken<boolean>('stream.secured');
export const STREAM_PROTOCOLS = new InjectionToken<string|string[]>('stream.protocols');

@Injectable({ providedIn: 'root' })
export class StreamService extends Socket {
	constructor(
		@Optional() @Inject(STREAM_SECURED) secured: boolean,
		@Optional() @Inject(STREAM_PROTOCOLS) protocols: string|string[],
	) { super(secured || false, protocols || ''); }
}
