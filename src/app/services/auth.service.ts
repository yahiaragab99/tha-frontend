import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  firstValueFrom,
  Observable,
  tap,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

const API_URL = environment.serverUrl + '/auth';
const LocalStorageUserKey = 'authUser';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authUser = new BehaviorSubject<User | null>(null);
  router = inject(Router);
  private http = inject(HttpClient);
  constructor() {
    this.restoreUserFromLocalStorage();
  }
  private restoreUserFromLocalStorage() {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);

        // Validate the parsed user data if needed
        if (this.isValidUser(parsedUser)) {
          this.authUser.next(parsedUser);
        } else {
          // Clear invalid localStorage data
          localStorage.removeItem('authUser');
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('authUser');
      }
    }
  }
  isEmailRegistered(email: string): Observable<Boolean> {
    return this.http.post<Boolean>(`${API_URL}/isemailregistered/${email}`, {});
  }

  signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: string
  ) {
    return this.http.post(API_URL + '/signup', {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
    });
  }
  signIn(email: string, password: string) {
    return this.http.post<any>(
      API_URL + '/login',
      { email, password },
      { withCredentials: true }
    );
  }

  getCurrentUser(): User | null {
    // Returns the current value of the BehaviorSubject
    return this.authUser.getValue();
  }

  setUserData(user: User) {
    // push to the subject
    this.authUser.next(user);

    // set in LS
    localStorage.setItem(LocalStorageUserKey, JSON.stringify(user));

    // set in session storage
    sessionStorage.setItem('userId', user.id as string);
  }

  clearUserData() {
    this.authUser.next(null);
    localStorage.removeItem(LocalStorageUserKey);
    sessionStorage.removeItem('userId');
  }

  signOut() {
    // const userId = sessionStorage.getItem('userId') as string;
    this.http
      .post(API_URL + '/logout', {}, { withCredentials: true })
      .subscribe(() => {
        this.clearUserData();
        this.router.navigateByUrl('/login');
      });
  }
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

  private isValidUser(user: User): boolean {
    // Add your custom validation logic
    return user && user.id != null;
  }
}
