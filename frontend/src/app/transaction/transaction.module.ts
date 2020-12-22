import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionPageRoutingModule } from './transaction-routing.module';

import { TransactionPage } from './transaction.page';
import { TransactionRawdataPage } from '../transaction-rawdata/transaction-rawdata.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionPageRoutingModule
  ],
  declarations: [TransactionPage, TransactionRawdataPage],
  entryComponents: [TransactionRawdataPage]
})
export class TransactionPageModule {}
