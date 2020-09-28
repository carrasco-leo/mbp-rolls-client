//
// app.module.ts — mbp-rolls-client
// ~/src/app
//

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { environment } from 'environments/environment';

import { AppComponent } from './app.component';
import { AppThemingService, STORAGE } from './app-theming.service';
import { STREAM_SECURED, STREAM_PROTOCOLS } from './stream';

const MODULES = [
	CommonModule,
	BrowserModule,
	BrowserAnimationsModule,
	MatToolbarModule,
	MatButtonModule,
	MatIconModule,
	MatSlideToggleModule,
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
