import { DeleteUserComponent } from './../delete-user/delete-user.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { tap, startWith, map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { NewUserComponent } from './../new-user/new-user.component';
import { AuthService } from './../../core/services/auth.service';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatabaseService } from 'src/app/core/services/database.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  displayedColumns: string[] = ['index', 'displayName', 'email', 'phone', 'role', 'jobTitle', 'edit'];
  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator, { static: false }) set content2(paginator: MatPaginator) {
    this.dataSource.paginator = paginator;
  }
  @ViewChild(MatSort, { static: false }) set content(sort: MatSort) {
    this.dataSource.sort = sort;
  }

  users$: Observable<any>

  dataFormGroup: FormGroup

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.dataFormGroup = this.fb.group({
      search: ""
    })

    this.users$ =
      combineLatest(
        this.dbs.users$
          .pipe(
            map(user => {
              let result = []
              user.forEach((el, ind) => {
                result.push(
                  {
                    ...el,
                    index: ind
                  }
                )
              })
              return result
            })
          ),
        this.dataFormGroup.get('search').valueChanges
          .pipe(
            startWith('')
          )
      )
        .pipe(
          map(([users, word]) => users.filter(user => user.displayName.toLowerCase().includes(word.toLowerCase()))),
          tap(res => {
            if (res) {
              this.dataSource.data = res
            }
          })
        )

  }

  createNewUser(): void {
    this.dialog.open(NewUserComponent);
  }



  editUser(user): void {
    this.dialog.open(NewUserComponent, {
      data: user
    })
  }

  deleteUser(user): void {
    this.dialog.open(DeleteUserComponent,{
       data: user
     })
  }

}
