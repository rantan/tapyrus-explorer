import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlocksPage } from './blocks.page';

const routes: Routes = [
  {
    path: '',
    component: BlocksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlocksPageRoutingModule {}
