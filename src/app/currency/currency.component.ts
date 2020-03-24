import { Currency } from './../shared/interfaces/currency';
import { CurrencyService } from './../shared/currency.service';
import { Component, OnInit, ViewChild , AfterViewInit, ElementRef, OnDestroy} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {FormControl, FormGroup} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatTableDataSource} from '@angular/material/table';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/shared/format-datepicker';
import * as moment from 'moment';
import {default as rollupMoment} from 'moment';
import { SubscriptionLike, fromEvent } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';



const somemoment = rollupMoment || moment;

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.css'],
  providers: [
    {provide: DateAdapter, useClass: AppDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS},
  ]
})
export class CurrencyComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private currencyService: CurrencyService) { }
    @ViewChild('dp1', {read: ElementRef}) dp1: ElementRef;
    @ViewChild('dp2', {read: ElementRef}) dp2: ElementRef;
    @ViewChild(MatSort) sort: MatSort;
    form: FormGroup;
    date1: string;
    date2: string;
    dateform1 = new FormControl();
    dateform2 = new FormControl();
    datearray: string[] = [];
    newarray: any[];
    arrayLength=true;
    checkButton = true;
    totalDays = false;
    subscription: SubscriptionLike;
    displayedColumns: string[] = ['date', 'usd', 'eur', 'gbr'];
    dataSource = new MatTableDataSource<Currency>(this.newarray);

    ngOnInit() {


     }
 ngAfterViewInit() {
     this.dataSource.sort = this.sort;
     console.log(this.sort);

    //  fromEvent(this.dp2.nativeElement,'change').subscribe((x)=>{
    //   var duration=moment.duration(moment(this.date2,'YYYYMMDD').diff(moment(this.date1,'YYYYMMDD')))
    //   var totalday=duration.asDays()
    //   if(totalday > 5)
    //   {
    //   this.totalDays=true;

    //   }
    //   else {
    //     this.checkButton=false
    //     this.totalDays=false;
    //   }
    //  }
    //  )
  }
 addEvent1( event: MatDatepickerInputEvent<Date>) {
  this.date1 = moment(event.target.value).format('YYYYMMDD');
}
 addEvent2(event: MatDatepickerInputEvent<Date>) {
 this.date2 = moment(event.target.value).format('YYYYMMDD');
  // tslint:disable-next-line: prefer-const
  let duration = moment.duration(moment(this.date2, 'YYYYMMDD').diff(moment(this.date1, 'YYYYMMDD')));
  const totalday = duration.asDays();
  if (totalday > 5) {
  this.totalDays = true;

  } else {
    this.checkButton = false;
    this.totalDays = false;
  }
}

getData() {
  this.getTimeArray(this.date1 || moment().format('YYYYMMDD'), this.date2 || moment().format('YYYYMMDD'));
  const currency = [];
  this.datearray.forEach((date) => {
    this.subscription = this.currencyService.getCurrence(date).subscribe((res: Currency) => {currency.push(res),
   this.newarray = [...currency].sort((date1, date2) => {
          return moment(date2, 'YYYYMMDD').diff(moment(date1, 'YYYYMMDD') );
      });
      if (this.newarray.length > 0) {
        this.arrayLength = false;
      }
    } );
    } );
}
getTimeArray(date1, date2) {
  const fromDate = moment(date1, 'YYYYMMDD').subtract(1, 'days');
  const toDate = moment(date2, 'YYYYMMDD');
  let date = fromDate.add(1, 'days');
  while (toDate >= date) {
    this.datearray.push(date.format('YYYYMMDD'));
    date = moment(date).add(1, 'days');
  }
   }
   ngOnDestroy() {
  if (this.subscription) {
    this.subscription.unsubscribe();
    this.subscription = null;
  }
}

}



