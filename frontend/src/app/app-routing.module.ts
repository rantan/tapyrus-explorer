import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/blocks',
    pathMatch: 'full'
  },
  {
    path: 'blocks',
    loadChildren: () => import('./blocks/blocks.module').then( m => m.BlocksPageModule)
  },
  {
    path: 'blocks/:hash',
    loadChildren: () => import('./block/block.module').then( m => m.BlockPageModule)
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then( m => m.TransactionsPageModule)
  },
  {
    path: 'block-rawdata',
    loadChildren: () => import('./block-rawdata/block-rawdata.module').then( m => m.BlockRawdataPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
