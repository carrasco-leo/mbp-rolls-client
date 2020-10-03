//
// user-action-panel.module.ts — mbp-rolls-client
// ~/src/app/user-action-panel
//

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from 'app/material';

import { UserActionPanelComponent } from './user-action-panel.component';
import { DiceDirective } from './dice.directive';

@NgModule({
	imports:         [CommonModule, FormsModule, MaterialModule],
	exports:         [UserActionPanelComponent],
	providers:       [],
	declarations:    [UserActionPanelComponent, DiceDirective],
	entryComponents: [],
})
export class UserActionPanelModule {}
