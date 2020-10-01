//
// history-event.ts — mbp-rolls-client
// ~/src/app/stream
//

export interface HistoryConnectionEvent {
	type: 'connection';
	id: string;
	username: string;
	date: string;
}

export interface HistoryDisconnectionEvent {
	type: 'disconnection';
	id: string;
	username: string;
	date: string;
}

export interface HistoryRollEvent {
	type: 'roll';
	id: string;
	uid: string;
	username: string;
	date: string;
	dices: number;
	difficulty: number;
	bonus: number;
	rolls: number[];
	discarded: number[];
	resolved: boolean;
}

export type HistoryEvent =
	HistoryRollEvent
	|HistoryConnectionEvent
	|HistoryDisconnectionEvent
	;
