import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NavController } from '@ionic/angular';

import { BackendService } from '../backend.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
  providers: [BackendService]
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
    private navCtrl: NavController,
    private backendService: BackendService
  ) {}

  ngOnInit() {
    this.getTransactionLists();
  }

  getTransactionLists() {
    this.backendService.getTransactions(this.page, this.perPage)
      .subscribe(
        (data) => {
          const resultData: any = data || {};
          this.transactions = resultData.results || [];
          this.txCount = resultData.txCount;
          this.calculatePagination();
        },
        (err) => {
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
    this.backendService.searchTransaction(this.searchValue)
      .subscribe(
        (data) => {
          this.transactions = [data];
          this.pages = 1;
          this.page = 1;
          this.txCount = 1;
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
