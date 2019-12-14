import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { BehaviorSubject, of, Observable, forkJoin } from 'rxjs';
import { finalize, take, shareReplay, filter, distinctUntilChanged, tap, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  public usersCollection: AngularFirestoreCollection<any>;
  public users$: Observable<any>;

  public requestsCollection: AngularFirestoreCollection<any>;
  public requests$: Observable<any>;

  public requestsListCollection: AngularFirestoreCollection<any>;
  public requestsList$: Observable<any>;

  constructor(
    public auth: AuthService,
    public af: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.getusers()
    this.getrequests()
  }
  getusers() {
    this.usersCollection = this.af.collection<any>(`users`, ref => ref.orderBy('displayName', 'asc'));
    this.users$ = this.usersCollection.valueChanges()
      .pipe(
        shareReplay(1)
      )
  }
  getrequests() {
    this.requestsCollection = this.af.collection<any>(`requests`, ref => ref.orderBy('regDate', 'asc'));
    this.requests$ = this.requestsCollection.valueChanges()
      .pipe(
        shareReplay(1)
      )
  }
  getrequestsList(sid: string) {
    this.requestsListCollection = this.af.collection<any>(`users/${sid}/requests`, ref => ref.orderBy('regDate', 'asc'));
    this.requestsList$ =
      this.requestsListCollection.valueChanges()
        .pipe(
          shareReplay(1)
        );
  }
  saveRequests(uid, data, comment) {
    const batch = this.af.firestore.batch();
    const requestRef = this.requestsCollection.doc(data.id).ref
    batch.set(requestRef, data)
    const userRef =
      this.usersCollection
        .doc(uid)
        .collection(`requests`)
        .doc(data.id).ref;
    batch.set(userRef, data)


    batch.commit().then(res => {
      this.saveComment(uid, data.id, comment)
      console.log('request save');

    })
  }
  saveComment(uid, id, comment) {
    //to do
    let data = {
      regDate: new Date(),
      comment: comment['comment'],
      files: [],
      createdBy: comment.createdBy
    }
    const batch = this.af.firestore.batch();
    const requestDoc = this.af.firestore.collection(`requests`).doc(id).collection(`comments`).doc();

    batch.set(requestDoc, data)
    const userRef =
      this.usersCollection
        .doc(uid).collection(`requests`).doc(id).collection(`comments`)
        .doc(requestDoc.id).ref;

    batch.set(userRef, data)

    batch.commit().then(res => {
      console.log('comment save');

      if (comment.files.length) {
        console.log('aqui files');
        
        comment.files.forEach((file, index) => {
          const filePath = `/commentsFiles/${Date.now()}_${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);
          task.snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL()
                .subscribe(fileURL => {
                  if (fileURL) {
                    data.files.push(fileURL)
                    console.log(data.files);
                    
                    const batch = this.af.firestore.batch();
                    batch.update(requestDoc, { files: data.files })
                    batch.update(userRef, { files: data.files })
                    batch.commit().then(res => {
                      console.log('file numero  ' + index);

                    })
                  }
                })
            })).subscribe()
        })
      }
    })



  }
}
