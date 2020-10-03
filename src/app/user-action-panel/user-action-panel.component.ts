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

import { MatSnackBar } from '@angular/material/snack-bar';

import { StreamService } from '../stream';

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

	pending: boolean = false;

	get disableStart() {
		return !(this.dices > 0) || !(this.difficulty > 0);
	}

	constructor(
		public stream: StreamService,
		private snackBar: MatSnackBar,
	) {}

	startStep() {
		if (this.disableStart || this.pending) {
			return;
		}

		const bonus = (this.bonus < 0) ? 0 : this.bonus || 0;
		this.pending = true;

		this.stream.startStep(this.dices, this.difficulty, bonus)
			.then((event) => {
				this.rolls = [...event.rolls];
				this.discards = this.rolls.map(() => 0);
				this.bonus = bonus;
			})
			.catch((error) => this._errorMsg(error))
			.then(() => this.pending = false)
	}

	// errors are already globaly handled
	private _errorMsg(error: Error) {
		// this.snackBar.open(error.message, 'Dismiss', {
		// 	duration: 5000,
		// 	panelClass: 'mat-error',
		// });
	}
}
