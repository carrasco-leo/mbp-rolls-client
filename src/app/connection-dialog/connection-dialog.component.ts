//
// connection-dialog.component.ts — mbp-rolls-client
// ~/src/app/connection-dialog
//

import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
} from '@angular/core';

import { MatDialogRef } from '@angular/material/dialog';

import { filter } from 'rxjs/operators';

import { StreamService } from '../stream';

@Component({
	selector:            'connection-dialog',
	templateUrl:         './connection-dialog.component.pug',
	styleUrls:           ['./connection-dialog.component.scss'],
	encapsulation:       ViewEncapsulation.None,
	preserveWhitespaces: true,
	host: {
		'[class.connection-dialog]': 'true',
		'[class.connection-dialog-connecting]': 'connecting',
	},
})
export class ConnectionDialogComponent {
	address: string = '';
	username: string = '';
	error: string = null;

	get connecting() {
		return this.stream.state !== 'close' && !this.stream.isConnected;
	}

	get disableSubmit() {
		return !this.address.trim() || !this.username.trim();
	}

	constructor(
		private dialogRef: MatDialogRef<ConnectionDialogComponent, void>,
		private stream: StreamService,
	) {}

	ngOnInit() {
		if (this.stream.state === 'pending') {
			this.stream.disconnect();
		}

		this.dialogRef.beforeClosed()
			.pipe(filter(() => !this.stream.isConnected))
			.subscribe(() => this.stream.disconnect());
	}

	submit() {
		if (this.disableSubmit) {
			return;
		}

		const username = this.username.trim();
		const address = this.address.trim();

		this.stream.connectWithUsername(username, address)
			.then(() => this.dialogRef.close())
			.catch((error) => this.error = error.message)
	}
}
