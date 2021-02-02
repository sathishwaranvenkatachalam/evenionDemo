import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { from, Observable } from 'rxjs';
import { concatAll, distinct, map, mergeAll, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.scss']
})
export class ContainerComponent implements OnInit {

  table = [];
  year = new FormControl('')
  month = new FormControl('');
  uniqueYears = [];
  uniqueMonths = [];
  filteredYear:Observable<any>;
  filteredMonth:Observable<any>;
  
  constructor() { }

  ngOnInit(): void {
    let concatTable = [];
    this.table = [
      [
        {year : "2012",month :  "January", price : "$400"},
        {year : "2013",month :  "February", price : "$900"},
        {year : "2014",month :  "March", price : "$800"},
        {year : "2014",month :  "May", price : "$920"}
      ], 
      [
        {year : "2012",month :  "December", price : "$390"},
        {year : "2012",month :  "January", price : "$400"},
        {year : "2013",month :  "February", price : "$600"},
        {year : "2015",month :  "April", price : "$700"}
      ]
    ]
    this.table.forEach(table => {
      concatTable.push(...table);
    });
    this.getUniqueValues(concatTable, 'month');
    this.getUniqueValues(concatTable, 'year');
    this.filteredMonth = this.year.valueChanges.pipe(
      startWith(''),
      map(year => {
        const months = concatTable.filter(element => element.year == year).map(ele=> ele.month);
        if(months.length > 0) {
          const res = this._filter(months, 'month');
          if(res.length == 1 && this.month.value != res[0]) {
            this.month.setValue(res[0]);
          }
          return res;
        } else {
          return [...this.uniqueMonths];
        }
    }));

    this.filteredYear = this.month.valueChanges.pipe(
      startWith(''),
      map(month => {
        const years = concatTable.filter(element => element.month == month).map(ele=>ele.year);
        if(years.length > 0) {
          const res = this._filter(years, 'year');
          if(res.length == 1 && this.year.value != res[0]) {
            this.year.setValue(res[0]);
          }
          return res;
        } else {
          return [...this.uniqueYears];
        }
    }));
  }

  private _filter(values: any[], key: string): string[] {
    let results = [];
    if(key == 'month') {
     results = this.uniqueMonths.filter(option => values.includes(option))
    } else {
     results = this.uniqueYears.filter(option => values.includes(option))
    }
    return results;
  }

  getUniqueValues(source, key) {
   from(source).pipe(
      distinct((p) => p[key])
    ).subscribe((res:any) => {
      if(key == 'year') {
        this.uniqueYears.push(res.year);
      } else {
        this.uniqueMonths.push(res.month);
      }
    })
  }

  reset() {
    this.year.setValue('');
    this.month.setValue('');
  }

}
