//
// events.ts — mbp-rolls-client
// ~/src/app/stream
//

export interface SocketOpenEvent {
	type: 'open';
}

export interface SocketCloseEvent {
	type: 'close';
	code: number;
	reason: string;
	wasClean: boolean;
}

export interface SocketMessageEvent {
	type: 'message';
	data: any;
}

export interface SocketErrorEvent {
	type: 'error';
	reason: string;
}

export type SocketEvent =
	SocketOpenEvent
	|SocketCloseEvent
	|SocketMessageEvent
	|SocketErrorEvent
	;
