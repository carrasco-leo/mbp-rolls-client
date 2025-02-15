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
			.pipe(filter((event) => this.stream.isConnected || event.type === 'welcome'))
			.subscribe((event) => {
				if (event.type === 'error') {
					this._errorMsg(event.reason);
				} else if (event.type === 'welcome') {
					console.log('welcome', event);
					this.history = event.history.map((value) => {
						value.type = 'roll';
						return value;
					});
				}
			});

		this.stream.events
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(filter((event) => event.type === 'close'))
			.subscribe(() => this.history = []);

		this._handleAdditions();
		this._handleEditions();
		this._handleDeletions();
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	openConnection() {
		this.connection.open();
	}

	closeConnection() {
		this.stream.disconnect();
	}

	private _errorMsg(message: string) {
		return this.snackBar.open(message, 'Dismiss', {
			duration: 5000,
			panelClass: 'mat-error',
		});
	}

	private _handleAdditions() {
		return this.stream.addition
			.pipe(takeUntil(this.ngUnsubscribe))
			.subscribe((event) => this.history.push(event));
	}

	private _handleEditions() {
		return this.stream.edition
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(tap((event) => this.updated[event.id] = true))
			.pipe(delay(200))
			.pipe(tap((event) => delete this.updated[event.id]))
			.subscribe();
	}

	private _handleDeletions() {
		return this.stream.deletion
			.pipe(takeUntil(this.ngUnsubscribe))
			.pipe(tap((event) => this.deleted[event.id] = true))
			.pipe(delay(200))
			.pipe(tap((event) => delete this.deleted[event.id]))
			.pipe(delay(1000))
			.pipe(tap((event) => {
				const index = this.history.indexOf(event);
				if (index !== -1) {
					this.history.splice(index, 1);
				}
			}))
			.subscribe();
	}
}
