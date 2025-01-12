import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { Preferences } from '@capacitor/preferences';

const API_URL = environment.serverUrl + '/auth';
const LocalStorageUserKey = 'authUser';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authUser = new BehaviorSubject<User | null>(null);
  router = inject(Router);
  storageService = inject(StorageService);
  private http = inject(HttpClient);
  // private advancedHttp = inject(HTTP);
  constructor() {
    this.initialize();
  }

  private async initialize() {
    await this.storageService.init();
    await this.restoreUserFromLocalStorage();
  }

  private async restoreUserFromLocalStorage() {
    const storedUser = await this.storageService.get(LocalStorageUserKey);
    if (storedUser) {
      try {
        const parsedUser: User = storedUser;
        // console.log('parsedUser', parsedUser);
        // Validate the parsed user data if needed
        if (this.isValidUser(parsedUser)) {
          this.authUser.next(parsedUser);
          const currentRoute = this.router.url;
          if (currentRoute == '/login' || currentRoute == '/signup') {
            this.router.navigate(['dashboard']);
          }
        } else {
          // Clear invalid localStorage data
          this.storageService.remove(LocalStorageUserKey);
        }
      } catch (error) {
        console.error('Error parsing stored user:', error);
        this.storageService.remove(LocalStorageUserKey);
      }
    }
  }

  autoLogin() {
    Preferences.get({ key: 'jwt' }).then((res) => {
      if (res.value) {
        this.getLoggedInUser().subscribe({
          next: (res: any) => {
            if (!res || Object.keys(res).length === 0)
              throw new Error('Invalid credentials');
            this.setUserData(res.user as User);
            this.router.navigate(['dashboard']);
          },
        });
      }
    });
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
    const response = this.http.post<any>(
      API_URL + '/login',
      { email, password },
      { withCredentials: true }
    );
    response.subscribe({
      next: (res) => {
        const { token } = res;
        Preferences.set({ key: 'jwt', value: token });
      },
    });
    return response;
  }

  getCurrentUser(): User | null {
    // Returns the current value of the BehaviorSubject
    return this.authUser.value;
  }

  setUserData(user: User | null, token?: string) {
    this.authUser.next(user);
    this.storageService.set(LocalStorageUserKey, user);
    if (!token) return;
    Preferences.set({ key: 'jwt', value: token });
  }

  clearUserData() {
    this.authUser.next(null);
    this.storageService.remove(LocalStorageUserKey);
    // this.storageService.clear();
    Preferences.remove({ key: 'jwt' });
  }

  signOut() {
    this.http
      .post(API_URL + '/logout', {}, { withCredentials: true })
      .subscribe(() => {
        this.clearUserData();
        this.router.navigateByUrl('/login');
      });
  }
  async isLoggedIn() {
    const userLocalStorage = await this.storageService.get(LocalStorageUserKey);
    // console.log('hi', userLocalStorage);
    if (!userLocalStorage || userLocalStorage == null) {
      return false;
    }
    return true;
  }

  private isValidUser(user: User): boolean {
    // Add your custom validation logic
    return user && user.id != null;
  }

  updateUser(user: User) {
    return this.http.put(API_URL + '/user/' + user.id, {
      newUserData: user,
    });
  }

  getUser(userId: string | null | undefined) {
    return this.http.get(API_URL + '/user/' + userId);
  }

  getLoggedInUser() {
    return this.http.get(API_URL + '/user/me', { withCredentials: true });
  }
}
