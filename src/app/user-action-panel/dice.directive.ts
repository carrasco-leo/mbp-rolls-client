//
// dice.directive.ts — mbp-rolls-client
// ~/src/app/user-action-panel
//

import {
	Directive,
	Input,
	Output,
	HostListener,
	EventEmitter,
} from '@angular/core';

@Directive({
	selector: 'dice, [dice]',
	host: {
		'[class.dice]': 'true',
		'[class.dice-rollable]': 'value === 5',
		'[class.dice-failed]': 'value === 0',
		'[class.dice-passed]': 'value >= difficulty',
		'[class.dice-discarded]': 'discarded',
	},
})
export class DiceDirective {
	private startY: number = null;
	private startTime: number = null;
	private auxtriggered: boolean = false;

	@Output('discarded') discardedChange: EventEmitter<number> = new EventEmitter();
	@Output() modified: EventEmitter<number> = new EventEmitter();

	@Input() value: number;
	@Input() difficulty: number;
	@Input() discarded: boolean;

	/*
	** left => +1
	** right => -1
	** ctrl + left => discard +1
	** ctrl + right => discard +3
	*/

	@HostListener('click', ['$event'])
	click(event: MouseEvent) {
		event.stopPropagation();
		event.preventDefault();

		// discard
		if (event.ctrlKey) {
			if (event.button === 0 || event.button === 2) {
				const value = (event.button === 0) ? 1 : 3;
				this.discardedChange.emit(this.discarded ? 0 : value);
			}
		} else if (event.button === 0) {
			this.modified.emit(1);
		} else if (event.button === 2) {
			this.modified.emit(-1);
		}
	}

	@HostListener('auxclick', ['$event'])
	auxclick(event: MouseEvent) {
		event.stopPropagation();
		event.preventDefault();
		this.auxtriggered = true;

		if (event.button !== 2) {
			return;
		}

		// discard
		if (event.ctrlKey) {
			this.discardedChange.emit(this.discarded ? 0 : 3);
		} else {
			this.modified.emit(-1);
		}
	}

	@HostListener('contextmenu', ['$event'])
	contextmenu(event: MouseEvent) {
		event.stopPropagation();
		event.preventDefault();

		if (this.auxtriggered) {
			return this.auxtriggered = false;
		}

		// discard
		if (event.ctrlKey) {
			this.discardedChange.emit(this.discarded ? 0 : 3);
		} else {
			this.modified.emit(-1);
		}
	}

	/*
	** up => +1
	** down => -1
	** short => discard +1
	** long => discard +3
	*/

	@HostListener('touchstart', ['$event'])
	touchStart(event: TouchEvent) {
		event.stopPropagation();
		event.preventDefault();

		this.startY = event.changedTouches[0].screenY;
		this.startTime = event.timeStamp;
	}

	@HostListener('touchend', ['$event'])
	touchEnd(event: TouchEvent) {
		event.stopPropagation();
		event.preventDefault();

		const delta = this.startY - event.changedTouches[0].screenY;
		const delay = event.timeStamp - this.startTime;

		if (delta <= -50) {
			this.modified.emit(-1);
		} else if (delta >= 50) {
			this.modified.emit(+1);
		} else if (delta === 0) {
			if (this.discarded) {
				this.discardedChange.emit(0);
			} else if (delay > 500) {
				this.discardedChange.emit(3);
			} else {
				this.discardedChange.emit(1);
			}
		}
	}
}
