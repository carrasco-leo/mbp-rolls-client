//
// connection-dialog.module.ts — mbp-rolls-client
// ~/src/app/connection-dialog
//

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ConnectionDialogComponent } from './connection-dialog.component';
import { ConnectionDialog } from './connection-dialog.service';

const MATERIALS = [
	MatDialogModule,
	MatButtonModule,
	MatFormFieldModule,
	MatInputModule,
	MatProgressSpinnerModule,
];

@NgModule({
	imports:         [CommonModule, FormsModule, MATERIALS],
	exports:         [],
	providers:       [ConnectionDialog],
	declarations:    [ConnectionDialogComponent],
	entryComponents: [ConnectionDialogComponent],
})
export class ConnectionDialogModule {}
