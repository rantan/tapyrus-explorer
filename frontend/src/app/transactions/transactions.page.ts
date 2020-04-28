import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {
  perPage = 25; // default with 20 per page
  page = 1; // default start with page 1
  pages = 1; // number of pages
  transactions: any = [];
  searchValue: string;
  txCount = 0;

  constructor(
    private httpClient: HttpClient,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.getTransactionLists();
  }

  getTransactionLists() {
    this.httpClient.get('http://localhost:3001/transactions', {
      params: new HttpParams({
        fromObject: {
          page: this.page.toString(),
          perPage: this.perPage.toString(),
        }
      })
    }).subscribe(
      data => {
        const resultData: any = data || {};
        this.transactions = resultData.transactions || [];
        this.txCount = resultData.txStats.txcount;
        this.calculatePagination();
      },
      err => {
        console.log(err);
      }
    );
  }

  onPageChange(pageNumber: number) {
    this.page = pageNumber;
    this.getTransactionLists();
  }

  onPerPageChange() {
    this.page = 1;
    this.getTransactionLists();
  }

  calculatePagination() {
    this.pages = Math.ceil(this.txCount / this.perPage);
  }

  goToTransaction(txid: string) {
    this.navCtrl.navigateForward(`/transactions/${txid}`);
  }

  onSearch() {
    console.log('onSearch', this.searchValue);
  }

}
