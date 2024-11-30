import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';

const API_URL = environment.serverUrl + '/auth';
const LocalStorageUserKey = 'authUser';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authUser = new BehaviorSubject<User | null>(null);
  private http = inject(HttpClient);
  constructor() {}

  isEmailRegistered(email: string): Observable<Boolean> {
    return this.http.post<Boolean>(`${API_URL}/is-email-registered`, { email });
  }

  signUp(email: string, password: string) {
    return this.http.post(API_URL + '/sign-up', { email, password });
  }
  signIn(
    email: string,
    password: string // : Promise<Subscription> | Error
  ) {
    return this.http.post(
      API_URL + '/log-in',
      { email, password },
      { withCredentials: true }
    );
  }

  setUserData(user: User) {
    // push to the subject
    this.authUser.next(user);

    // set in LS
    localStorage.setItem(LocalStorageUserKey, JSON.stringify(user));
  }

  clearUserData() {
    this.authUser.next(null);
    localStorage.removeItem(LocalStorageUserKey);
  }

  // signOut() {
  //   this.http
  //     .post(API_URL + '/logout', {}, { withCredentials: true })
  //     .subscribe(() => {
  //       this.clearUserData();

  //       if (
  //         this.currentRoute &&
  //         !this.PINGING_ROUTES.includes(this.currentRoute)
  //       ) {
  //         this.router.navigateByUrl('/');
  //       }
  //     });
  // }
  get isLoggedIn() {
    if (
      !localStorage.getItem(LocalStorageUserKey) ||
      localStorage.getItem(LocalStorageUserKey) == null
    ) {
      console.log("Didn't pass Auth Guard Front End!!");
      return false;
    }
    console.log('Passed Auth Guard Front End!!');

    return true;
  }
}
