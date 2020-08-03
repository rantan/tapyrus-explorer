import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlockRawdataPage } from './block-rawdata.page';

const routes: Routes = [
  {
    path: '',
    component: BlockRawdataPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlockRawdataPageRoutingModule {}
