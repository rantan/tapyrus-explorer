import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TransactionsPageRoutingModule } from './transactions-routing.module';

import { TransactionsPage } from './transactions.page';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedPipeModule } from '../modules/sharePipe.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TransactionsPageRoutingModule,
    SharedPipeModule,
    NgxPaginationModule
  ],
  declarations: [TransactionsPage]
})
export class TransactionsPageModule {}
