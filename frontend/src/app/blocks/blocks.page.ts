import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { BlockPage } from '../block/block.page';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.page.html',
  styleUrls: ['./blocks.page.scss'],
})
export class BlocksPage implements OnInit {
  perPage = 25; // default with 20 per page
  page = 1; // default start with page 1
  pages = 1; // number of pages
  transactions: any = [];
  searchValue: string;

  constructor(
    private httpClient: HttpClient,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.getBlockLists();
  }

  getBlockLists() {
    this.httpClient.get('http://localhost:3001/list', {
      params: new HttpParams({
        fromObject: {
          page: this.page.toString(),
          perPage: this.perPage.toString(),
        }
      })
    }).subscribe(
      data => {
        const resultData: any = data || {};
        const txnsData: any = resultData.results || [];
        this.transactions = txnsData.sort(this.compareHeight);
        this.calculatePagination(resultData.bestHeight);
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
    this.getBlockLists();
  }

  onPerPageChange() {
    this.page = 1;
    this.getBlockLists();
  }

  calculatePagination(bestHeight: number) {
    this.pages = Math.ceil(bestHeight / this.perPage);
  }

  goToBlock(hash: string) {
    this.navCtrl.navigateForward(`/blocks/${hash}`);
  }

  onSearch() {
    console.log('onSearch', this.searchValue);
  }

}
