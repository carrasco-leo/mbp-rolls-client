//
// app-theming.service.ts — mbp-rolls-client
// ~/src/app
//

import { Injectable, Inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const STORAGE = new InjectionToken<Storage>('app-theming-storage');

@Injectable()
export class AppThemingService {
	readonly storageKey: string = 'dark-theme-enabled';
	darkTheme: boolean;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		@Inject(STORAGE) private storage: Storage,
	) {}

	init() {
		const value = (this.storage.getItem(this.storageKey) || '').toLowerCase();
		this.darkTheme = value !== 'false' && value !== '0' && value !== 'no';
		this.toggle(this.darkTheme);
	}

	toggle(darkTheme: boolean = !this.darkTheme): void {
		this.darkTheme = darkTheme;

		if (this.darkTheme) {
			this.document.documentElement.dataset.theme = 'dark';
			this.storage.setItem(this.storageKey, 'true');
		} else {
			this.document.documentElement.dataset.theme = 'light';
			this.storage.setItem(this.storageKey, 'false');
		}
	}
}
