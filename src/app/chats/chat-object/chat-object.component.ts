import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Chat } from 'src/app/models/chat.model';
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
  informationCircle,
  chevronForward,
} from 'ionicons/icons';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat-object',
  templateUrl: './chat-object.component.html',
  styleUrls: ['./chat-object.component.scss'],
  standalone: true,
  imports: [
    IonItemOptions,
    IonItemSliding,
    IonSpinner,
    IonIcon,
    IonButton,
    IonItem,
    IonText,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
  ],
})
export class ChatObjectComponent {
  @Input() chat!: Chat;
  @Output() deleteClick = new EventEmitter<void>();
  chatService = inject(ChatService);

  router = inject(Router);

  isDeleteLoading: boolean = false;
  constructor() {
    addIcons({ chevronForward, informationCircle, trashOutline });
  }

  openChatDetails() {
    this.chatService.setSelectedChat(this.chat);
    this.router.navigate(['chatsdetails']);
    //  + this.chat.qrCodeId]);
  }
}
