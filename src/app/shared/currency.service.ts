import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {map, filter, pluck, delay} from 'rxjs/operators';
import { Currency } from './interfaces/currency';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private http:HttpClient) { }
   getCurrence(date):Observable<any>{
     return this.http.get<Currency>(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json?valcode=${''}&date=${date}&json`)
      .pipe(map((val)=> new Object({
    date:val[25].exchangedate,
    gbr:val[25].rate,
    eur:val[33].rate,
    usd:val[26].rate
   })))
  }
  }
