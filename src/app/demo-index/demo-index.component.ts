import { Component, AfterViewInit, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import {DemoServiceService} from '../demo-service.service';
import { FormGroup,FormControl, Validators } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-demo-index',
  templateUrl: './demo-index.component.html',
  styleUrls: ['./demo-index.component.scss']
})
export class DemoIndexComponent implements  OnInit {
  posts:any;
  datasource: any=[];
  //showFilter:boolean=false;
 
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtOptions: DataTables.Settings = {}
  dtTrigger: Subject<any> = new Subject<any>();
  
  claimForm:FormGroup
  claimInnerForm:FormGroup

  // material table section...

  claimData:ClaimModel[]=[]
  displayedColumns: string[] = ['date', 'temperature', 'visibility', 'main','wind'];
  dataSource = new MatTableDataSource<ClaimModel>(this.claimData);
  @ViewChild('claimPaginator', { read: MatPaginator })
  paginator!: MatPaginator;
  //...........................
  constructor(private service:DemoServiceService) {}

  get billingTin() {
    return this.claimForm.get('billingTin');
 }
 get mediclaidId() {
  return this.claimForm.get('mediclaidId');
 }
 get renderingNpi() {
   return this.claimForm.get('renderingNpi');
 }
get showFilter() {
  return this.claimForm.get('showFilter')
}
get showFilterAll() {
  return this.claimForm.get('showFilterAll')
}
get showFilter2() {
  return  this.claimInnerForm.get('showFilter2')
}
get filter1 () {
  return this.claimInnerForm.get('filter1')
}
get filter2 () {
  return this.claimInnerForm.get('filter2')
}
onChangeFilter(val) {
  if (val===false) {
    console.log('h')
    this.claimInnerForm.reset()
  } else {
    this.claimForm.get('showFilterAll').reset()
    this.claimInnerForm.get('showFilter2').reset()
  }
}
onChangeFilter2(val) {
  if (val===false) {
    console.log('h',val)
    this.claimInnerForm.reset()
  } else {
    this.claimForm.get('showFilterAll').reset()
  } 
}
onChangeFilterAll(val) {
  if (val) {
    console.log('h',val)
    this.claimForm.get('showFilter').reset()
    this.claimInnerForm.get('showFilter2').reset()
  } else {
    debugger
    this.claimForm.get('showFilter').setValue(true)
    this.claimInnerForm.get('showFilter2').setValue(true)
  }
}
 /* showFilterFunc(){
   this.showFilter= this.showFilter === false ? this.showFilter =true : this.showFilter = false;
 } */
 changeTin() {
  this.billingTin.updateValueAndValidity();
 }
 isValidFormSubmitted = null;
 onFormSubmit() {
   console.log('hh')
   console.log(this.billingTin)
   console.log(this.mediclaidId)
   console.log(this.renderingNpi)
   console.log(this.showFilter)
  this.isValidFormSubmitted = false;
  if (this.claimForm.invalid) {
     return;
  }
  
}
  ngOnInit() {
    this.claimForm=new FormGroup({
      claimNumber:new FormControl(null),
      mediclaidId : new FormControl("",[Validators.minLength(10)]),
      billingTin: new FormControl(null,[Validators.minLength(10)]),
      renderingNpi: new FormControl(null,[Validators.minLength(10)]),
      showFilter: new FormControl(false),
      showFilterAll: new FormControl(false)
      
    })
    this.claimInnerForm = new FormGroup({
      showFilter2: new FormControl(false),
      filter1:new FormControl(null),
      filter2:new FormControl(null)
    });

    console.log('init')
    this.dtOptions = {
      destroy: true,
      rowCallback: (row: Node, data: any[] | Object, index: number) => {
        const self = this;
        $('td', row).off('click');
        $('td', row).on('click', () => {
          $('tr').removeClass('highlight')
          $(row).addClass('highlight')
          self.someClickHandler(data);
        });
        return row;
      }
    };
  }
  message = '';
  someClickHandler(info: any): void {
    this.message = info.id + ' - ' + info.firstName;
    console.log(info)
  }
  removeText() {
    this.posts = [];
  }
  showText(title:string) {
    $('#equictntbl').DataTable().clear().destroy();
    if(title!="")
  {
    this.service.getPosts(title)
    .subscribe(response => {
      console.log('trigger',this.dtOptions)
      this.posts = [];
      this.posts = response;
      this.claimData=JSON.parse(JSON.stringify(response)).list;
      console.log(this.claimData)
      this.dataSource = new MatTableDataSource<ClaimModel>(this.claimData);
      this.dataSource.paginator = this.paginator;
      console.log(this.claimData)
      setTimeout(() => {
        this.dtTrigger.next()
       
      });
    });
  }
  else
  {
   alert("Fill the city first!!!");
  }
  }
  ngOnDestroy(): void {
    $.fn['dataTable'].ext.search.pop();
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }
}

export interface ClaimModel {
date:string,
temperature:string,
visibility:string,
main:string,
wind:string
}