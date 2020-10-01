//
// history-event.module.ts — mbp-rolls-client
// ~/src/app/history-event
//

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HistoryEventComponent } from './history-event.component';
import { SlPipe } from './sl.pipe';

@NgModule({
	imports:         [CommonModule],
	exports:         [HistoryEventComponent],
	providers:       [],
	declarations:    [HistoryEventComponent, SlPipe],
	entryComponents: [],
})
export class HistoryEventModule {}
