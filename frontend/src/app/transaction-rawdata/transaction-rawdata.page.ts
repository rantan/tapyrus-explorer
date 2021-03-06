import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transaction-rawdata',
  templateUrl: './transaction-rawdata.page.html',
  styleUrls: ['./transaction-rawdata.page.scss'],
})
export class TransactionRawdataPage implements OnInit {

  @Input() txid: string;
  txRawData = '';
  copied = false;

  constructor(
    private navParams: NavParams,
    private httpClient: HttpClient,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {
    this.txid = this.navParams.get('txid');
    this.getTxRawData();
  }

  getTxRawData() {
    this.httpClient.get(`http://localhost:3001/transaction/${this.txid}/rawData`).subscribe(
      data => {
        const result: any = data || '';
        this.txRawData = result;
      },
      err => {
        console.log(err);
      }
    );
  }

  copyTxRawData() {
    const textArea = document.createElement('textarea');
    textArea.value = this.txRawData;

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      this.copied = true;
      setTimeout(() => { this.copied = false; }, 800);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

}
