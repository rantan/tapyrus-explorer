import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ModalController, NavController } from '@ionic/angular';
import { BlockRawdataPage } from '../block-rawdata/block-rawdata.page';

@Component({
  selector: 'app-block',
  templateUrl: './block.page.html',
  styleUrls: ['./block.page.scss'],
})
export class BlockPage implements OnInit {

  blockHash: string;
  block: any = {};

  constructor(
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.blockHash = this.activatedRoute.snapshot.paramMap.get('hash');
    this.getBlockInfo();
  }

  getBlockInfo() {
    this.httpClient.get(`http://localhost:3001/block/${this.blockHash}`).subscribe(
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

}
