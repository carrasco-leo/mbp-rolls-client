//
// history-event.component.ts — mbp-rolls-client
// ~/src/app/history-event
//

import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
} from '@angular/core';

import { HistoryEvent, HistoryRollEvent } from '../stream';

@Component({
	selector:            'history-event',
	templateUrl:         './history-event.component.pug',
	styleUrls:           ['./history-event.component.scss'],
	encapsulation:       ViewEncapsulation.None,
	preserveWhitespaces: true,
	host: {
		'[class.history-event]': 'true',
		'[class.history-status-event]': 'event.type !== "roll"',
	},
})
export class HistoryEventComponent {
	@Input() event: HistoryEvent;

	get rollEvent() { return this.event as HistoryRollEvent; }

	message: string;

	constructor(
	) {}

	ngOnChanges() {
		if (this.event.type === 'connection') {
			this.message = `${this.event.username} is connected`;
		} else if (this.event.type === 'disconnection') {
			this.message = `${this.event.username} disconnected`;
		}
	}
}
