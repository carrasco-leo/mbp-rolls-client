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
import { takeUntil, map, filter } from 'rxjs/operators';

import { AppThemingService } from './app-theming.service';
import { ConnectionDialog } from './connection-dialog';
import { StreamService, StreamErrorEvent } from './stream';

@Component({
	selector:            'app-root',
	templateUrl:         './app.component.pug',
	styleUrls:           ['./app.component.scss'],
	encapsulation:       ViewEncapsulation.None,
	preserveWhitespaces: true,
})
export class AppComponent implements OnInit, OnDestroy {
	private ngUnsubscribe = new Subject();

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
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	openConnection() {
		this.connection.open();
	}
}
