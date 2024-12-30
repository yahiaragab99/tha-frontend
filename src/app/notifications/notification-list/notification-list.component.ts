import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonList } from '@ionic/angular/standalone';
import { NotificationObjectComponent } from '../notification-object/notification-object.component';
import { Notification } from 'src/app/models/notification.model';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  standalone: true,
  imports: [IonList, NotificationObjectComponent],
})
export class NotificationListComponent {
  @Input() notifications: Notification[] = [];
  @Output() delete = new EventEmitter<Notification>();
  @Output() read = new EventEmitter<Notification>();

  constructor() {}
  onDelete(notification: Notification) {
    this.delete.emit(notification);
  }

  onRead(notification: Notification) {
    this.read.emit(notification);
  }
}
