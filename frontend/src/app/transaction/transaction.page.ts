import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { TransactionRawdataPage } from '../transaction-rawdata/transaction-rawdata.page';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.page.html',
  styleUrls: ['./transaction.page.scss'],
})
export class TransactionPage implements OnInit {
  txid: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.txid = this.activatedRoute.snapshot.paramMap.get('txid');
    console.log(this.txid)
    this.getTransactionInfo();
  }

  getTransactionInfo() {

  }

  goToTransactions() {
    this.navCtrl.navigateBack('/transactions');
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
