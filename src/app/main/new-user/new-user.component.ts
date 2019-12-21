import { AuthService } from './../../core/services/auth.service';
import { Observable, combineLatest } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, Inject } from '@angular/core';
import { DatabaseService } from 'src/app/core/services/database.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { debounceTime, map, startWith, filter } from 'rxjs/operators';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  loading: boolean = false;
  newUserFormGroup: FormGroup;

  personalDataFormGroup: FormGroup;
  jobDataFormGroup: FormGroup;

  httpOptions;
  now: Date = new Date();
  userEmailResults: Array<string> = [];
  visibility: string = 'password';

  duplicated$: Observable<any>;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dbs: DatabaseService,
    public auth: AuthService,
    public dialogRef: MatDialogRef<NewUserComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-type': 'application/form-data'
      })
    };
  }

  ngOnInit() {

    if (this.data) {
      this.personalDataFormGroup = this.fb.group({
        name: [this.data['displayName'].split(' ')[0], Validators.required],
        lastname: [this.data['displayName'].split(' ')[1], Validators.required],
        email: [this.data['email'], Validators.required],
        phone: this.data['phone']
      })

      this.jobDataFormGroup = this.fb.group({
        jobTitle: [this.data['jobTitle'], Validators.required],
        role: [this.data['role'], Validators.required]
      })
    } else {
      this.personalDataFormGroup = this.fb.group({
        name: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', Validators.required],
        phone: '',
        password: ['', Validators.required],
      })

      this.jobDataFormGroup = this.fb.group({
        jobTitle: ['', Validators.required],
        role: ['', Validators.required]
      })
    }

    this.duplicated$ =
      combineLatest(
        this.dbs.users$,
        this.personalDataFormGroup.get('email').valueChanges
      ).pipe(
        filter(([users, input]) => !!users),
        map(([users, input]) => {
          let exist = false;

          users.forEach(user => {
            if (user.email === input) {
              exist = true;
            }
          });

          return exist;
        })
      );

  }

  toggleVisibility(): void {
    if (this.visibility === 'password') {
      this.visibility = 'text';
    } else if (this.visibility === 'text') {
      this.visibility = 'password';
    }
  }

  registerUser(): void {
    let data = {
      email: this.personalDataFormGroup.get('email').value,
      //password: this.dataFormGroup.get('pass').value,
      displayName: 'Melanie Ocharan'
    }
    this.auth.signUp(data)
      .then(res => {
        this.snackbar.open('Bienvenid@!', 'Cerrar', {
          duration: 6000
        });
        this.dialogRef.close(true);
      })
      .catch(error => {
        this.snackbar.open('Parece que hubo un error ...', 'Cerrar', {
          duration: 6000
        });
        console.log(error);
      });
  }

  updateUser(uid) {
    let data = {
      displayName: this.personalDataFormGroup.value['name'].split(" ", 1)[0] + ' ' + this.personalDataFormGroup.value['lastname'].split(" ", 1)[0],
      email: this.personalDataFormGroup.get('email').value,
      phone: this.personalDataFormGroup.get('phone').value,
      jobTitle: this.jobDataFormGroup.get('jobTitle').value,
      role: this.jobDataFormGroup.get('role').value,
    }
    this.dbs.updateUser(uid, data)
  }
  create(): void {
    this.http.post(`https://us-central1-crc-support.cloudfunctions.net/msCreateUser/?email=${this.personalDataFormGroup.value['email']}&displayName=${this.personalDataFormGroup.value['name'].split(" ", 1)[0] + ' ' + this.personalDataFormGroup.value['lastname'].split(" ", 1)[0]}&password=${this.personalDataFormGroup.value['password']}`
      , this.data
      , this.httpOptions)
      .subscribe(res => {
        if (res['result'] === "ERROR") {
          switch (res['code']) {
            case "auth/email-already-exists":
              this.snackbar.open("Error: Este correo ya existe", "Cerrar", {
                duration: 6000
              });
              this.loading = false;
              break;

            default:
              break;
          }
        }

        if (res['result'] === "OK") {

          let updateData = {
            displayName: this.personalDataFormGroup.value['name'].split(" ", 1)[0] + ', ' + this.personalDataFormGroup.value['lastname'].split(" ", 1)[0],
            email: this.personalDataFormGroup.get('email').value,
            phone: this.personalDataFormGroup.get('phone').value,
            password: this.personalDataFormGroup.get('password').value,
            jobTitle: this.jobDataFormGroup.get('jobTitle').value,
            role: this.jobDataFormGroup.get('role').value,
            uid: res['uid'],
            regDate: Date.now(),
          }

          this.dbs.addUser(updateData)
            .then(() => {
              this.loading = false;
              this.dialogRef.close();
              this.snackbar.open("Usuario creado!", "Cerrar");
            })
            .catch(err => {
              console.log(err);
              this.snackbar.open("Ups! parece que hubo un error ...", "Cerrar");
            })
        }

      })

    /*this.dbs.addUser(updateData)
      .then(() => {
        this.loading = false;
        this.dialogRef.close();
        this.snackbar.open("Usuario creado!","Cerrar");
      })
      .catch(err => {
        console.log(err);
        this.snackbar.open("Ups! parece que hubo un error ...","Cerrar");
      })*/
  }

}
