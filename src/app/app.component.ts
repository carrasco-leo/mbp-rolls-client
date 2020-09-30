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

import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';

import { AppThemingService } from './app-theming.service';
import { ConnectionDialog } from './connection-dialog';
import { StreamService } from './stream';

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
	) {}

	ngOnInit() {
		this.theming.init();
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}

	openConnection() {
		this.connection.open();
	}
}
