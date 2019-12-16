import { FormGroup, FormBuilder } from '@angular/forms';
import { map, debounceTime, distinctUntilChanged, startWith, combineAll, filter } from 'rxjs/operators';
import { Observable, combineLatest, of, race } from 'rxjs';
import { AuthService } from './../../core/services/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { DatabaseService } from 'src/app/core/services/database.service';


@Component({
  selector: 'app-list-request',
  templateUrl: './list-request.component.html',
  styleUrls: ['./list-request.component.css']
})


export class ListRequestComponent implements OnInit {
  displayedColumns: string[] = ['subject', 'id', 'created', 'lastactivity', 'status'];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  search: boolean = false
  search$: Observable<any>

  requests$: Observable<any>
  requestOn$: Observable<any>

  search1FormGroup: FormGroup;
  search2FormGroup: FormGroup;


  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    public auth: AuthService,
    public dbs: DatabaseService,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;

    this.search1FormGroup = this.fb.group({
      search1: '',
      status1: ''
    })

    this.search2FormGroup = this.fb.group({
      search2: '',
      status2: ''
    });

    this.requestOn$ =
      combineLatest(
        this.dbs.requests$,
        this.auth.user$,
      ).pipe(
        map(([requests, user]) => {
          let result = []
          requests.forEach(request => {
            request.users.forEach(ele => {
              if (ele.uid == user.uid) {
                result.push(request)
              }
            })
          })
          return result
        })
      )
      this.requests$ =
      combineLatest(
        this.dbs.requests$,
        this.auth.user$,
      ).pipe(
        map(([requests, user]) => requests.filter(el=>el.requester.uid===user.uid))
      )
    

    this.requests$.subscribe(res => {
      if (res) {
        console.log(res);
        
        this.dataSource.data = res
      }
    })
    this.requestOn$.subscribe(res => {
      if (res) {
        this.dataSource2.data = res
      }
    })
  }
  searching(e) {
    this.search$ = this.requests$.pipe(
      map(request => request.filter(el => el.name.toLowerCase().includes(e.toLowerCase())))
    )

    this.search$.subscribe(res => {
      if (res) {
        this.dataSource.data = res
      }
    })
  }

  searching2(e) {
    console.log(e);
    this.search$ = this.requestOn$.pipe(
      map(request => request.filter(el => el.name.toLowerCase().includes(e.toLowerCase())))
    )

    this.search$.subscribe(res => {
      if (res) {
        this.dataSource2.data = res
      }
    })
  }
  selectState() {
    let e = this.search1FormGroup.get("status1").value
    this.search$ = this.requests$.pipe(
      map(request => e == "Todos" ? request : request.filter(el => el.status == e))
    )

    this.search$.subscribe(res => {
      if (res) {
        this.dataSource.data = res
      }
    })
  }

  selectState2() {
    let e = this.search2FormGroup.get("status2").value
    this.search$ = this.requestOn$.pipe(
      map(request => e == "Todos" ? request : request.filter(el => el.status == e))
    )

    this.search$.subscribe(res => {
      if (res) {
        this.dataSource2.data = res
      }
    })
  }



}
