import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const API_BASE_URL = environment.serverUrl + '/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);

  constructor() {}
  getUserNotifications(userId: string | null | undefined) {
    return this.http.get(API_BASE_URL + '/user/' + userId);
  }

  deleteNotification(notificationId: string) {
    return this.http.delete(API_BASE_URL + '/' + notificationId);
  }

  readNotification(notificationId: string) {
    return this.http.put(API_BASE_URL + '/read/' + notificationId, {});
  }
}
