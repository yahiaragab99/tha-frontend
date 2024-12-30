import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../models/notification.model';
import { NotificationListComponent } from './notification-list/notification-list.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    NotificationListComponent,
  ],
})
export class NotificationsComponent implements OnInit {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  notifications!: Notification[];
  currentUser!: User | null;
  constructor() {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    this.notificationService
      .getUserNotifications(this.currentUser?.id)
      .subscribe({
        next: (res: any) => {
          if (!res.items) return;
          this.notifications = res.items.map((notification: any) => {
            return {
              ...notification,
              createdat: new Date(notification.createdat).toLocaleString(
                'en-US',
                {
                  year: 'numeric',
                  month: 'short',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false,
                }
              ),
            };
          });
          console.log(this.notifications);
        },
      });
  }

  onDeleteNotification(notification: Notification) {
    this.notificationService.deleteNotification(notification.id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(
          (n) => n.id !== notification.id
        );
      },
    });
  }

  onReadNotification(notification: Notification) {
    this.notificationService.readNotification(notification.id).subscribe({
      next: () => {
        this.notificationService
          .getUserNotifications(this.currentUser?.id)
          .subscribe({
            next: (res: any) => {
              this.notifications = res.items;
              console.log(res);
            },
          });
      },
    });
  }
}
