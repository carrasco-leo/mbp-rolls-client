//
// dice.directive.ts — mbp-rolls-client
// ~/src/app/user-action-panel
//

import {
	Directive,
	Input,
	Output,
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
	@Input() value: number;
	@Input() difficulty: number;
	@Input() discarded: boolean;
}
