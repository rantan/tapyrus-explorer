import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
  block = {};
  qrcode = 'tapyrus:';
  address = '';
  balanced: number;
  received: number;
  sent: number;
  txidsCount = 0;
  result: any;
  transactions = [];
  unspentDatas = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
  ) { }

  ngOnInit() {
    this.address = this.activatedRoute.snapshot.paramMap.get('address');
    this.qrcode = 'tapyrus:' + this.address;
    this.getAddressInfo();
  }

  getAddressInfo() {
    this.httpClient.get(`http://localhost:3001/address/${this.address}`).subscribe(
      data => {
        this.received = data[0];
        this.result = data[1][0];
        this.unspentDatas = data[2];
        if (this.result && this.result.txids) {
          this.txidsCount = this.result.txids.length;
          this.getTransactionsInfo(this.result.txids);
        }
        if (this.unspentDatas) {
          this.calculateBalanceAndTotal();
        }
        console.log(data);
      },
      err => {
        console.log(err);
      }
    );
  }

  getTransactionsInfo(txids = []) {
    this.transactions = [];
    for (const txid of txids) {
      this.httpClient.get(`http://localhost:3001/transaction/${txid}/get`).subscribe(
        data => {
          this.transactions.push(data);
          console.log(data);
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  calculateBalanceAndTotal() {
    let amount = 0;
    for (const unspend of this.unspentDatas) {
      amount += unspend.amount;
    }

    this.balanced = amount;
    this.sent = this.received - this.balanced;
  }

}
