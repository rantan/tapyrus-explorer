import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { BlockRawdataPage } from '../block-rawdata/block-rawdata.page';
import { BackendService } from "../backend.service";

@Component({
  selector: 'app-block',
  templateUrl: './block.page.html',
  styleUrls: ['./block.page.scss'],
  providers: [BackendService]
})
export class BlockPage implements OnInit {

  blockHash: string;
  block: any = {};
  blockTxns: any = {};
  openTxns = false;

  txConfirmation: number;
  txTime: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private backendService: BackendService
  ) { }

  ngOnInit() {
    this.blockHash = this.activatedRoute.snapshot.paramMap.get('hash');
    this.getBlockInfo();
  }

  getBlockInfo() {
    this.backendService.getBlock(this.blockHash).subscribe(
      data => {
        this.block = data || {};
      },
      err => {
        console.log(err);
      }
    );
  }

  goToBlocks() {
    this.navCtrl.navigateBack('/blocks');
  }

  async goToBlockRawData() {
    const modal = await this.modalCtrl.create({
      component: BlockRawdataPage,
      componentProps: {
        blockHash: this.blockHash
      },
      cssClass: 'raw-data-modal'
    });
    return await modal.present();
  }

  getBlockTxnsInfo() {
    this.backendService.getBlockTransactions(this.blockHash).subscribe(
      data => {
        this.blockTxns = data || {};
        this.txConfirmation = this.blockTxns.confirmations;
        this.txTime = this.blockTxns.time;
        this.openTxns = true;
        this.calculateVoutTotalAndFee();
      },
      err => {
        console.log(err);
      }
    );
  }

  closeTxns() {
    this.openTxns = false;
  }

  async calculateVoutTotalAndFee() {
    await this.blockTxns.tx.forEach(tx => {
      let voutValue = 0;
      let vinValue = 0;
      for (const vout of tx.vout) {
        if (vout.value) {
          voutValue += vout.value;
        }
      }
      for (const vin of tx.vinRaw) {
        if (vin && vin.vout) {
          for (const vout of vin.vout) {
            if (vout && vout.value) {
              vinValue += vout.value;
            }
          }
        }
      }
      tx.totalVout = voutValue;
      tx.totalVin = vinValue;
      tx.totalFee = vinValue - voutValue;
    });
  }

  goToAddress(add = '') {
    this.navCtrl.navigateForward(`/addresses/${add}`);
  }

  goToTransaction(txid = '') {
    this.navCtrl.navigateForward(`/transactions/${txid}`);
  }
}
