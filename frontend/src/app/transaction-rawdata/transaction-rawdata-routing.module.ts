import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionRawdataPage } from './transaction-rawdata.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionRawdataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionRawdataPageRoutingModule {}
