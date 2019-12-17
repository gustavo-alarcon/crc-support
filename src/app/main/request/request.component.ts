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
  isSolved: boolean = false
  selectedFile: Array<any> = []
  constructor(
    public dbs: DatabaseService,
    public auth: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {


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
          this.currentUser = user
          this.dbs.getComments(route.id)
          request.forEach(el => {
            if (el.id == route.id) {
              index = {
                ...el,
                comunicador: user.role == 'communicator',
                admin: user.role == 'admin',
                isrequester: el['requester']['uid'] == user['uid']
              }
            }
          })
          return index
        })
      )

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

  send(uid, request, respond) {
    let text = this.dataFormGroup.get('text').value.split(/\r?\n/g).filter(option => !!option).join('//')
    let comment = {
      regDate: new Date(),
      comment: text,
      files: this.selectedFile,
      createdBy: this.currentUser
    }
    this.dbs.updateRequest(uid, request.id, comment, respond, this.isSolved)
    
    let message = {
      toUids: [this.currentUser.uid!==uid?uid:request.users.map(el=>el.uid)],
      template: {
        name: 'email',
        data: {
          subject: "Solicitud: "+ request.subject,
          comment:text.split('//'),
          user: this.currentUser.displayName,
          request: request.subject,
          id: request.id.substring(1)
        }
      }
    }

    this.dbs.sendEmail(message)
    

    this.dataFormGroup.reset()
    this.isSolved = false





  }
}
