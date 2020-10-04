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
	prevDiscards: number[];
	modifiers: number[];
	selected: boolean[];
	bonusLeft: number;
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
				this.modifiers = this.rolls.map(() => 0);
				this.bonusLeft = this.bonus = bonus;
			})
			.catch((error) => this._errorMsg(error))
			.then(() => this.pending = false)
	}

	modifiersStep() {
		if (this.pending) {
			return;
		}

		this.pending = true;

		this.stream.modifiersStep(this.modifiers, this.discards)
			.then((event) => {
				this.rolls = this.rolls.map((value, index) => value + this.modifiers[index]);
				this.selected = this.rolls.map(() => false);
			})
			.catch((error) => this._errorMsg(error))
			.then(() => this.pending = false)
	}

	rerollsStep() {
		if (this.pending) {
			return;
		}

		this.pending = true;

		this.stream.rerollsStep(this.selected)
			.then((event) => {
				this.rolls = [...event.rolls];
				this.discards = this.rolls.map(() => 0);
				this.prevDiscards = [...event.discarded];
				this.bonusLeft = event.bonus;
			})
			.catch(() => this.selected = this.rolls.map(() => false))
			.then(() => this.pending = false)
	}

	modifyDice(index: number, value: number) {
		if (this.modifiers[index] + value < 0) {
			return;
		} else if (this.bonusLeft - value < 0) {
			return;
		} else if (this.discards[index]) {
			return;
		}

		this.modifiers[index] += value;
		this.bonusLeft -= value;
	}

	modifyDiscard(index: number, value: number) {
		if (value === 0 && this.discards[index] === 0) {
			return;
		} else if (value !== 0 && this.discards[index] !== 0) {
			return;
		}

		if (value === 0) {
			if (this.discards[index] === 0 || this.bonusLeft < this.discards[index]) {
				return;
			}

			this.bonusLeft -= this.discards[index];
			this.discards[index] = 0;
		} else {
			if (this.discards[index] !== 0) {
				return;
			}

			this.bonusLeft += value;
			this.discards[index] = value;
		}
	}

	resetModifiers() {
		this.discards = this.discards.map(() => 0);
		this.modifiers = this.modifiers.map(() => 0);
		this.bonusLeft = this.bonus;
	}

	toggleSelect(index: number) {
		this.selected[index] = !this.selected[index];
	}

	// errors are already globaly handled
	private _errorMsg(error: Error) {
		// this.snackBar.open(error.message, 'Dismiss', {
		// 	duration: 5000,
		// 	panelClass: 'mat-error',
		// });
	}
}
