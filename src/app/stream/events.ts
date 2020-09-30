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

export interface SocketMessageEvent<T = any> {
	type: 'message';
	data: T;
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

export interface StreamWelcomeEvent {
	type: 'welcome';
	id: string;
	users: { [key: string]: string; };
}

export interface StreamErrorEvent {
	type: 'error';
	reason: string;
}

export interface StreamConnectionEvent {
	type: 'connection';
	id: string;
	username: string;
}

export interface StreamDisconnectionEvent {
	type: 'disconnection';
	id: string;
}

export type StreamEvent =
	StreamWelcomeEvent
	|StreamErrorEvent
	|StreamConnectionEvent
	|StreamDisconnectionEvent
	;
