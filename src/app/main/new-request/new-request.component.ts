import { Observable, combineLatest } from 'rxjs';
import { AuthService } from './../../core/services/auth.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar, MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';
import { DatabaseService } from './../../core/services/database.service';
@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit {
  dataFormGroup: FormGroup;

  visible = true;
  selectable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  emails$: Observable<any>;
  users: Array<any> = []
  currentUser: any
  numberRequest: string
  selectedFile: Array<any> = []

  @ViewChild('fruitInput', { static: false }) fruitInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private snackbar: MatSnackBar,
    public dbs: DatabaseService
  ) { }

  ngOnInit() {
    this.createForm()
    this.auth.user$.subscribe(res => {
      if (res) {
        this.currentUser = res
      }
    })
    this.dbs.requests$.subscribe(res => {
      if (res) {
        this.numberRequest = ((res.length + 1).toString()).padStart(4, '0')
      }
    })
    this.emails$ =
      combineLatest(
        this.dbs.users$,
        this.dataFormGroup.get('cc').valueChanges
          .pipe(
            startWith<any>('')
          )
      ).pipe(
        map(([user, input]) => {
          const name = typeof input === 'string' ? input.toLowerCase() : '';
          const filtereduser = name ? user.filter(option => option.displayName.toLowerCase().includes(name)) : user;
          return filtereduser;
        })
      );
  }

  createForm(): void {
    this.dataFormGroup = this.fb.group({
      cc: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });
  }
  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.users.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }
    }
  }

  remove(index): void {

    if (index >= 0) {
      this.users.splice(index, 1);
    }
  }
  removeFile(index): void {

    if (index >= 0) {
      this.selectedFile.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.users.push(event.option.value);
    this.fruitInput.nativeElement.value = '';
  }
  showEmail(user): string | null {
    return user ? user.displayname : null;
  }
  onFileSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile.push(event.target.files[0])

    }
  }

  saveRequest() {
    let data = {
      regDate: new Date(),
      users: this.users.filter(el => el),//verificar que filtra
      status: 'En espera',
      lastActivity: new Date(),
      id: '#' + this.numberRequest,
      subject: this.dataFormGroup.get('subject').value,
      requester: this.currentUser
    }
    let comment = {
      regDate: new Date(),
      comment: this.dataFormGroup.get('description').value,
      files: this.selectedFile,
      createdBy: this.currentUser
    }

    this.dbs.saveRequests(this.currentUser.uid, data, comment)
    this.dataFormGroup.reset()
    this.users = []
    this.selectedFile = []

  }

}
