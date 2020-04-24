import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-block',
  templateUrl: './block.page.html',
  styleUrls: ['./block.page.scss'],
})
export class BlockPage implements OnInit {

  hash: string;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.hash = this.activatedRoute.snapshot.paramMap.get('hash');
    console.log(this.hash);
  }

}
