//
// user-action-panel.component.ts — mbp-rolls-client
// ~/src/app/user-action-panel
//

import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
} from '@angular/core';

@Component({
	selector:            'user-action-panel',
	templateUrl:         './user-action-panel.component.pug',
	styleUrls:           ['./user-action-panel.component.scss'],
	encapsulation:       ViewEncapsulation.None,
	preserveWhitespaces: true,
	host: {
		'[class.user-action-panel]': 'true',
	},
})
export class UserActionPanelComponent {
	dices: number;
	difficulty: number;
	bonus: number;

	rolls: number[];
	discards: number[];
	selected: boolean[];

	constructor(
	) {}
}
