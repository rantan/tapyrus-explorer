import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransactionRawdataPage } from './transaction-rawdata.page';

describe('TransactionRawdataPage', () => {
  let component: TransactionRawdataPage;
  let fixture: ComponentFixture<TransactionRawdataPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionRawdataPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionRawdataPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
