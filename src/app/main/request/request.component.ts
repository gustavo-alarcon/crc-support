import { AuthService } from './../../core/services/auth.service';
import { auth } from 'firebase/app';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatabaseService } from 'src/app/core/services/database.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {
  currentRequest$: Observable<any>
  comments$: Observable<any>
  dataFormGroup: FormGroup
  currentUser: any
  isRespond: boolean = false
  show: boolean = false
  isSolved: boolean = false
  selectedFile: Array<any> = []
  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.route.params.subscribe(res => {
      if (res) {
        this.dbs.getComments(res.id)
        this.dbs.comments$.subscribe(res => {
          if (res) {
            if (res.length > 1) {
              this.show = true
            }
          }
        })
      }
    })
    this.auth.user$.subscribe(res => {
      if (res) {
        this.currentUser = res
      }
    })
  }

  ngOnInit() {
    this.currentRequest$ =
      combineLatest(
        this.dbs.requests$,
        this.route.params,
        this.auth.user$
      ).pipe(
        map(([request, route, user]) => {
          let index = null
          request.forEach(el => {
            if (el.id == route.id) {
              index = el
              this.isRespond = el['requester']['uid'] !== user['uid']
            }
          })
          return index
        })
      )

    this.currentRequest$.subscribe(res => {
      if (res) {
        console.log(res);

      }
    })
    this.dataFormGroup = this.fb.group({
      text: [null, [Validators.required]]
    })

  }
  onFileSelected(event): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile.push(event.target.files[0])

    }
  }
  removeFile(index): void {

    if (index >= 0) {
      this.selectedFile.splice(index, 1);
    }
  }

  send(uid, id) {
    let comment = {
      regDate: new Date(),
      comment: this.dataFormGroup.get('text').value,
      files: this.selectedFile,
      createdBy: this.currentUser
    }
    this.dbs.updateRequest(uid, id, comment, this.isRespond, this.isSolved)

    
    this.dataFormGroup.reset()
    this.isSolved = false


    


  }
}
