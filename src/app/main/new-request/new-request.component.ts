import { AuthService } from './../../core/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent implements OnInit {
  dataFormGroup: FormGroup;
  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.createForm()
  }
  
  createForm(): void {
    this.dataFormGroup = this.fb.group({
      cc: [null, [Validators.required]],
      subject: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });
  }
}
