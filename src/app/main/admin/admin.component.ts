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

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  filteredUsers: Array<any> = [];

  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

    /*this.dbs.currentDataUsers.subscribe(res => {
      this.filteredUsers = res;
      this.dataSource.data = res;
    })
    */
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

  }


  filterData(ref: string) {
    /* ref = ref.toLowerCase();
     this.filteredUsers = this.dbs.users.filter(option =>
       option['displayName'].toLowerCase().includes(ref) ||
       option['email'].includes(ref));
 
     this.dataSource.data = this.filteredUsers;*/
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
    /* this.dialog.open(DeleteUserComponent,{
       data: user
     })*/
  }

}
