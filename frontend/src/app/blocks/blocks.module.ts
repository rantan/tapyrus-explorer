import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BlocksPageRoutingModule } from './blocks-routing.module';

import { BlocksPage } from './blocks.page';

import { SharedPipeModule } from '../modules/sharePipe.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BlocksPageRoutingModule,
    SharedPipeModule,
    NgxPaginationModule
  ],
  declarations: [BlocksPage]
})
export class BlocksPageModule {}
