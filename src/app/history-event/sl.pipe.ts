//
// sl.pipe.ts — mbp-rolls-client
// ~/src/app/history-event
//

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'sl',
})
export class SlPipe implements PipeTransform {
	transform(src: number[], threshold: number, discarded: number[]) {
		return src.filter((value, index) => !discarded[index] && value >= threshold).length;
	}
}
