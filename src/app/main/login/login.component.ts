import { AuthService } from './../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  dataFormGroup: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LoginComponent>,
    private fb: FormBuilder,
    public auth: AuthService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.createForm();
  }
  createForm(): void {
    this.dataFormGroup = this.fb.group({
      email: [null, [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
      pass: [null, [Validators.required, Validators.minLength(6)]]
    });
  }
  login(): void {
    this.auth.singIn(this.dataFormGroup.value['email'], this.dataFormGroup.value['pass'])
      .then(res => {
        this.snackbar.open('Hola!', 'Cerrar', {
          duration: 6000
        });
        this.dialogRef.close(true);
      })
      .catch(err => {
        this.snackbar.open('Parece que hubo un error ...', 'Cerrar', {
          duration: 6000
        });
        console.log(err.message);
      })
  }

}
