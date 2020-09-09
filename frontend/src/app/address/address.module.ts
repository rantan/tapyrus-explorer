import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddressPageRoutingModule } from './address-routing.module';

import { AddressPage } from './address.page';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { SharedPipeModule } from '../modules/sharePipe.module';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddressPageRoutingModule,
    NgxQRCodeModule,
    SharedPipeModule,
    NgxPaginationModule
  ],
  declarations: [AddressPage]
})
export class AddressPageModule {}
