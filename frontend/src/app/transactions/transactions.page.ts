import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.page.html',
  styleUrls: ['./transactions.page.scss'],
})
export class TransactionsPage implements OnInit {

  perPage = 15;
  page = 1;
  transactions: any = [];

  constructor(
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.getTxnsData();
  }

  getTxnsData() {
    this.httpClient.get('http://localhost:3001/list', {
      params: new HttpParams({
        fromObject: {
          page: this.page.toString(),
          perPage: this.perPage.toString(),
        }
      })
    }).subscribe(
      data => {
        const txnsData: any = data || [];
        this.transactions = txnsData.sort(this.compareHeight);
      },
      err => {
        console.log(err);
      }
    );
  }

  compareHeight(a: any, b: any) {
    if (a.height < b.height) {
      return 1;
    } else {
      return -1;
    }
  }

  onPageChange(pageNumber: number) {
    console.log(pageNumber);
    this.page = pageNumber;
    this.getTxnsData();
  }

  goToBlock() {
    console.log('goToBlock')
  }
}
