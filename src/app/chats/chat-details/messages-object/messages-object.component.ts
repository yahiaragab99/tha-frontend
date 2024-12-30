import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Message } from 'src/app/models/message.model';
import { IonIcon, IonItem, IonText } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline, chatbubble } from 'ionicons/icons';

@Component({
  selector: 'app-messages-object',
  templateUrl: './messages-object.component.html',
  styleUrls: ['./messages-object.component.scss'],
  standalone: true,
  imports: [IonItem, IonText, IonIcon],
})
export class MessagesObjectComponent {
  isDeleteLoading: boolean = false;
  @Input() message!: Message;
  @Output() deleteClick = new EventEmitter<void>();
  constructor() {
    addIcons({ chatbubble, trashOutline });
  }
}
