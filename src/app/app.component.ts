//
// app.component.ts — mbp-rolls-client
// ~/src/app
//

import {
	Component,
	ViewEncapsulation,
	OnInit,
	OnDestroy,
} from '@angular/core';

import { MatSnackBar } from '@angular/material/snack-bar';

import { Subject } from 'rxjs';
import { takeUntil, map, filter, delay, tap } from 'rxjs/operators';

import { AppThemingService } from './app-theming.service';
import { ConnectionDialog } from './connection-dialog';
import { StreamService, StreamErrorEvent, HistoryEvent } from './stream';

@Component({
	selector:            'app-root',
	templateUrl:         './app.component.pug',
	styleUrls:           ['./app.component.scss'],
	encapsulation:       ViewEncapsulation.None,
	preserveWhitespaces: true,
})
export class AppComponent implements OnInit, OnDestroy {
	private ngUnsubscribe = new Subject();

	updated: { [key: string]: boolean; } = {};
	deleted: { [key: string]: boolean; } = {};
	history: HistoryEvent[] = [];

	constructor(
		public theming: AppThemingService,
		private connection: ConnectionDialog,
		public stream: StreamService,
		private snackBar: MatSnackBar,
	) {}

	ngOnInit() {
		this.theming.init();

		this.stream.streamEvents
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(filter(() => this.stream.isConnected))
			.pipe(filter<StreamErrorEvent>((event) => event.type === 'error'))
			.subscribe((event) => this.snackBar.open(event.reason, 'Dismiss', {
				duration: 5000,
				panelClass: 'mat-error',
			}));

		this._handleAdditions();
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	openConnection() {
		this.connection.open();
	}

	private _handleAdditions() {
		this.stream.addition
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((event) => this.history.push(event));
	}
}
