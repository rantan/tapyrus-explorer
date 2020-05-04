import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-address',
  templateUrl: './address.page.html',
  styleUrls: ['./address.page.scss'],
})
export class AddressPage implements OnInit {
  block = {};
  qrcode = 'www.google.com';
  address = '';
  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.address = this.activatedRoute.snapshot.paramMap.get('address');
  }

}
