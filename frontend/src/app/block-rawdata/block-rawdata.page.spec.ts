import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BlockRawdataPage } from './block-rawdata.page';

describe('BlockRawdataPage', () => {
  let component: BlockRawdataPage;
  let fixture: ComponentFixture<BlockRawdataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BlockRawdataPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BlockRawdataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
