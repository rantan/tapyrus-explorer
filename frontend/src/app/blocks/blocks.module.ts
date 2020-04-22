import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlocksPageRoutingModule } from './blocks-routing.module';

import { BlocksPage } from './blocks.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlocksPageRoutingModule
  ],
  declarations: [BlocksPage]
})
export class BlocksPageModule {}
