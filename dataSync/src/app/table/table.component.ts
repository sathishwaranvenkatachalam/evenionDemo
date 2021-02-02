import { Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { data } from '../data.model';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() tableData:data[];
  @Input() filterYear:string;
  @Input() filterMonth:string;
  filteredResults = new MatTableDataSource();
  displayedColumns = ['year', 'month', 'price'];
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(change) {
    if(!!change.tableData) {
      this.filteredResults = new MatTableDataSource([...this.tableData]);
    }
    if(!!change.filterYear || !!change.filterMonth) {
      let results = [...this.tableData];
      if(!!this.filterMonth) {
        results = this.filterData(results, this.filterMonth, 'month')
      }
      if(!!this.filterYear){
        results = this.filterData(results, this.filterYear, 'year')
      }
      this.filteredResults = new MatTableDataSource([...results]);
    }
  }

  filterData(source,value, key) {    
    return source.filter(option => option[key].toLowerCase().indexOf(value.toLowerCase()) === 0)
  }

}
