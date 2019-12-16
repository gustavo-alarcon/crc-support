import { MainComponent } from './main.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { WebComponent } from './web/web.component';
import { LoginComponent } from './login/login.component';
import { NewRequestComponent } from './new-request/new-request.component';
import { RequestComponent } from './request/request.component';

import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatDialogModule,
  MatMenuModule,
  MatTabsModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatSelectModule,
  MatDividerModule,
  MatSnackBarModule,
  MatChipsModule,
  MatAutocompleteModule,
  MatStepperModule
} from '@angular/material';
import { ListRequestComponent } from './list-request/list-request.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminComponent } from './admin/admin.component';
import { NewUserComponent } from './new-user/new-user.component';

@NgModule({
  declarations: [
    WebComponent,
    MainComponent,
    LoginComponent,
    NewRequestComponent,
    RequestComponent,
    ListRequestComponent,
    AdminComponent,
    NewUserComponent],
  imports: [
    CommonModule,
    MainRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatMenuModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatDividerModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatStepperModule
  ],
  entryComponents: [
    LoginComponent,
    NewUserComponent
  ]
})
export class MainModule { }
