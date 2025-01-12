import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Notification } from 'src/app/models/notification.model';
import {
  IonButton,
  IonSpinner,
  IonIcon,
  IonItem,
  IonText,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  trashOutline,
  chatbubbles,
  informationCircle,
  pricetag,
  checkmarkDone,
  checkmark,
  call,
} from 'ionicons/icons';
@Component({
  selector: 'app-notification-object',
  templateUrl: './notification-object.component.html',
  styleUrls: ['./notification-object.component.scss'],
  standalone: true,
  imports: [
    IonButton,
    IonSpinner,
    IonIcon,
    IonItem,
    IonText,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
  ],
})
export class NotificationObjectComponent {
  @Input() notification!: Notification;
  @Output() deleteClick = new EventEmitter<void>();
  @Output() readClick = new EventEmitter<void>();

  isDeleteLoading: boolean = false;

  constructor() {
    addIcons({
      chatbubbles,
      pricetag,
      informationCircle,
      trashOutline,
      checkmarkDone,
      checkmark,
      call,
    });
  }
}
