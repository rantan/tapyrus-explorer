import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class BackendService {
  backendUrl = 'http://192.168.0.80:3001'
  constructor(private http: HttpClient) { }

  getBlocks(page: Number, perPage: Number): Observable<any> {
    return this.http.get(`${this.backendUrl}/blocks`, {
      params: new HttpParams({ fromObject: { page: page.toString(), perPage: perPage.toString() } })
    });
  }

  searchBlock(query: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/block/${query}`);
  }

  getBlock(blockHash: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/block/${blockHash}`);
  }

  getRawBlock(blockHash: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/block/${blockHash}/raw`);
  }

  getBlockTransactions(blockHash: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/block/${blockHash}/txns`);
  }

  getTransactions(page: Number, perPage: Number): Observable<any> {
    return this.http.get(`${this.backendUrl}/transactions`, {
      params: new HttpParams({ fromObject: { page, perPage } })
    });
  }

  getTransaction(txId: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/transaction/${txId}`);
  }

  getRawTransaction(txId: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/transaction/${txId}/rawData`);
  }

  getAddressInfo(address: string, page: Number, perPage: Number): Observable<any> {
    return this.http.get(`${this.backendUrl}/address/${address}`, {
      params: new HttpParams({ fromObject: { page: page.toString(), perPage: perPage.toString() } })
    });
  }

  searchTransaction(query: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/transaction/${query}/get`);
  }
}
