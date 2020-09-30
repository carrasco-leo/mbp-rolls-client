//
// connection-dialog.service.ts — mbp-rolls-client
// ~/src/app/connection-dialog
//

import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import { ConnectionDialogComponent } from './connection-dialog.component';

@Injectable()
export class ConnectionDialog {
	constructor(
		private dialog: MatDialog,
	) {}

	open<T>(config?: MatDialogConfig<T>) {
		return this.dialog.open(ConnectionDialogComponent, config || {
			width: '640px',
		});
	}
}
