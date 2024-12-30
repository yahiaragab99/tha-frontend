import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { Chat } from 'src/app/models/chat.model';
import { ChatService } from 'src/app/services/chat.service';
import { MessagesListComponent } from './messages-list/messages-list.component';
import { Message } from 'src/app/models/message.model';

@Component({
  selector: 'app-chat-details',
  templateUrl: './chat-details.component.html',
  styleUrls: ['./chat-details.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, MessagesListComponent],
})
export class ChatDetailsComponent implements OnInit {
  chatService = inject(ChatService);
  chat!: Chat | null;
  messages!: Message[];
  constructor() {}

  ngOnInit() {
    this.chat = this.chatService.getSelectedChat();
    this.messages = this.chat?.messages || [];
  }
}
