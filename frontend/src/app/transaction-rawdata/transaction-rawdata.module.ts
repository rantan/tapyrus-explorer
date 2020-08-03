import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionRawdataPageRoutingModule } from './transaction-rawdata-routing.module';

import { TransactionRawdataPage } from './transaction-rawdata.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionRawdataPageRoutingModule
  ],
  declarations: [TransactionRawdataPage]
})
export class TransactionRawdataPageModule {}
