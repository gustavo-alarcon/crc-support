import { FormGroup, FormBuilder } from '@angular/forms';
import { map, debounceTime, distinctUntilChanged, startWith, combineAll, filter, tap } from 'rxjs/operators';
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

  requests$: Observable<any>
  requestOn$: Observable<any>

  search1FormGroup: FormGroup;
  search2FormGroup: FormGroup;


  @ViewChild("paginator1", { static: true }) paginator1: MatPaginator;
  @ViewChild("paginator2", { static: true }) paginator2: MatPaginator;

  constructor(
    public auth: AuthService,
    public dbs: DatabaseService,
    private fb: FormBuilder
  ) {
   
  }

  ngOnInit() {
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
        this.search2FormGroup.get('search2').valueChanges.pipe(
          startWith('')
        ),
        this.search2FormGroup.get('status2').valueChanges.pipe(
          startWith('Todos')
        )

      ).pipe(
        map(([requests, user, word, state]) => {
          let result = []
          requests.forEach(request => {
            request.users.forEach(ele => {
              if (ele.uid == user.uid) {
                result.push(request)
              }
            })
          })
          let filterText = result.filter(el => el.subject.toLowerCase().includes(word.toLowerCase()))
          return state == "Todos" ? filterText : filterText.filter(el => el.status == state)
        }),
        tap(res => {
          this.dataSource2.data = res
          this.dataSource2.paginator = this.paginator2
        })
      )
    this.requests$ =
      combineLatest(
        this.dbs.requests$,
        this.auth.user$,
        this.search1FormGroup.get('search1').valueChanges
          .pipe(
            startWith('')
          ),
        this.search1FormGroup.get('status1').valueChanges
          .pipe(
            startWith('Todos')
          )
      ).pipe(
        map(([requests,user, word, state]) => {
          let result=requests.filter(el=>el.requester.uid===user.uid)
          let filterText = result.filter(el => el.subject.toLowerCase().includes(word.toLowerCase()))
          return state == "Todos" ? filterText : filterText.filter(el => el.status == state)
        }),
        tap(res => {
          if (res) {
            this.dataSource.data = res
            this.dataSource.paginator = this.paginator1
          }
        })
      )

  }
  


}
