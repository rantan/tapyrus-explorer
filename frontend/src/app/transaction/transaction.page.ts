import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';

import { TransactionRawdataPage } from '../transaction-rawdata/transaction-rawdata.page';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
  providers: [BackendService]
})
export class TransactionPage implements OnInit {
  txid: string;
  transaction: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.txid = this.activatedRoute.snapshot.paramMap.get('txid');
    this.getTransactionInfo();
  }

  getTransactionInfo() {
    this.backendService.getTransaction(this.txid).subscribe(
      data => {
        this.transaction = data || {};
        this.calculateTxSize();
        this.calculateVoutTotalAndFee();
      },
      err => {
        console.log(err);
      }
    );
  }

  calculateTxSize() {
    const vin = this.transaction.vin.length;
    const vout = this.transaction.vout.length;
    this.transaction.size = 148 * vin + 34 * vout + 10;
  }

  async calculateVoutTotalAndFee() {
    let voutValue = 0;
    let vinValue = 0;
    for (const vout of this.transaction.vout) {
      if (vout.value) {
        voutValue += vout.value;
      }
    }
    for (const vin of this.transaction.vin) {
      if (vin && vin.vout) {
        for (const vout of vin.vout) {
          if (vout && vout.value) {
            vinValue += vout.value;
          }
        }
      }
    }
    this.transaction.totalVout = voutValue;
    this.transaction.totalVin = vinValue;
    this.transaction.totalFee = vinValue - voutValue;
  }

  goToTransactions() {
    this.navCtrl.navigateBack('/tx/recent');
  }

  goToAddress(add = '') {
    this.navCtrl.navigateForward(`/addresses/${add}`);
  }

  async goToTransactionRawData() {
    const modal = await this.modalCtrl.create({
      component: TransactionRawdataPage,
      componentProps: {
        txid: this.txid
      },
      cssClass: 'raw-data-modal'
    });
    return await modal.present();
  }
}
