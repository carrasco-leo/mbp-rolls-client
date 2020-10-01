//
// app.module.ts — mbp-rolls-client
// ~/src/app
//

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { environment } from 'environments/environment';

import { AppComponent } from './app.component';
import { AppThemingService, STORAGE } from './app-theming.service';
import { STREAM_SECURED, STREAM_PROTOCOLS } from './stream';
import { ConnectionDialogModule } from './connection-dialog';
import { MaterialModule } from './material';
import { HistoryEventModule } from './history-event';

const MODULES = [
	CommonModule,
	BrowserModule,
	BrowserAnimationsModule,
	MaterialModule,
	ConnectionDialogModule,
	HistoryEventModule,
];

@NgModule({
	imports:      [MODULES],
	declarations: [AppComponent],
	bootstrap:    [AppComponent],
	providers:    [
		AppThemingService,
		{ provide: STORAGE, useValue: localStorage },
		{ provide: STREAM_SECURED, useValue: environment.stream.secured },
		{ provide: STREAM_PROTOCOLS, useValue: environment.stream.protocols },
	],
})
export class AppModule {
}
