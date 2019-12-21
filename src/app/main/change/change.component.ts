import { HttpClient } from '@angular/common/http';
import { DatabaseService } from 'src/app/core/services/database.service';
import { map, tap, debounceTime, switchMap, take } from 'rxjs/operators';
import { Observable, combineLatest, timer, of } from 'rxjs';
import { AuthService } from './../../core/services/auth.service';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.css']
})
export class ChangeComponent implements OnInit {

  httpOptions;
  _data;

  dataFormGroup: FormGroup;
  hidePass: boolean = true;
  hideRePass: boolean = true;


  constructor(
    public dialogRef: MatDialogRef<ChangeComponent>,
    private fb: FormBuilder,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    private http: HttpClient,
    public dbs: DatabaseService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.createForm();

  }
  createForm(): void {
    this.dataFormGroup = this.fb.group({
      currentPass: [null, [Validators.required, Validators.minLength(6)], [this.matchPassword(false)]],
      newPass: [null, [Validators.required, Validators.minLength(6)], [this.matchPassword(true)]]
    });
  }


  matchPassword(istrue: boolean): AsyncValidatorFn {
    return (control: AbstractControl) => {
      return combineLatest(
        control.valueChanges,
        this.auth.user$
      ).pipe(
        debounceTime(500),
        take(1),
        map(([pass, user]) => {
          if (istrue) {
            return pass == user.password ? { passValid: true } : null
          } else {
            return pass !== user.password ? { passValid: true } : null
          }
        })
      );

    }

  }


  reset() {
    this.http.post(`https://us-central1-crc-support.cloudfunctions.net/msUpdatePassword/?uid=${this.data['uid']}&password=${this.dataFormGroup.value['newPass']}`
      , this._data
      , this.httpOptions)
      .subscribe(res => {
        if (res['result'] === "ERROR") {
          switch (res['code']) {
            case "auth/email-already-exists":
              this.snackbar.open("Error: Este correo ya existe", "Cerrar", {
                duration: 6000
              });
              break;

            default:
              break;
          }
        }

        if (res['result'] === "OK") {

          this.dbs.usersCollection
            .doc(this.data['uid'])
            .update({ password: this.dataFormGroup.value['newPass'] })
            .then(() => {
              this.snackbar.open("Listo!", "Cerrar", {
                duration: 6000
              });
              this.dialogRef.close(true);
            })
            .catch(err => {
              console.log(err);
              this.snackbar.open("Ups..Parece que hubo un error actualizando la información de usuario", "Cerrar", {
                duration: 6000
              });
            })
        }
      })

  }
}
