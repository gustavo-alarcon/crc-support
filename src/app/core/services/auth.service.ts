import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          // cheking if user is logged, then return his/her info         
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          // if not logged, return an observable with null
          return of(null);
        }
      })
    );
   }
  /**
   * @desc Sign Up with google's services
   * @returns user credentials <Promise<any>>
   */
  async signUp(data: any): Promise<any> {
    const credential = await this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.password);
    return this.updateUserData(credential.user, data);
  }

  /**
   * @desc Sign In with google's services
   */
  singIn(email: string, pass: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, pass);
  }

  private updateUserData(user: any, data: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);

    const _data = {
      uid: user.uid,
      email: user.email,
      displayName: data.displayName,
      role: 'admin',
      regDate: new Date()
    }


    const batch = this.afs.firestore.batch();

    batch.set(userRef.ref, _data, { merge: true });
    return batch.commit();
  }

  async signOut() {
    await this.afAuth.auth.signOut();
    this.router.navigate([''])
  }
}
