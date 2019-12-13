import { AuthService } from './../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    public auth: AuthService
  ) { }

  ngOnInit() {

  }

  login() {
    this.dialog.open(LoginComponent, {
      width: "350px"
    })
  }

}
