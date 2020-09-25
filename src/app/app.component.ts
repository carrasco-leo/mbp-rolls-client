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
	) {}

	ngOnInit() {
		this.theming.init();
	}

	ngOnDestroy() {
		this.ngUnsubscribe.next();
		this.ngUnsubscribe.complete();
	}
}
