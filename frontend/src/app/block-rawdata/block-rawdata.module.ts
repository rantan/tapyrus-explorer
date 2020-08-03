import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlockRawdataPageRoutingModule } from './block-rawdata-routing.module';

import { BlockRawdataPage } from './block-rawdata.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlockRawdataPageRoutingModule
  ],
  declarations: [BlockRawdataPage]
})
export class BlockRawdataPageModule {}
