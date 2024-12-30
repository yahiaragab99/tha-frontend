import { Component, inject, OnInit } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { Message } from '../models/message.model';
import { ChatService } from '../services/chat.service';
import { AuthService } from '../services/auth.service';
import { ChatListComponent } from './chat-list/chat-list.component';
import { Chat } from '../models/chat.model';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, ChatListComponent],
})
export class ChatsComponent implements OnInit {
  userMessages: Message[] = [];
  userChats: Chat[] = [];
  chatService = inject(ChatService);
  authService = inject(AuthService);

  private currentUserId = this.authService.getCurrentUser()?.id;
  constructor() {}

  ngOnInit() {
    this.chatService.getUserChats(this.currentUserId).subscribe((res: any) => {
      this.userMessages = res.items;

      if (this.userMessages && this.userMessages.length > 0) {
        // Group messages by qrCodeId
        const messagesGroupedByQrCodeId = this.userMessages.reduce(
          (acc: { [key: string]: Message[] }, message: Message) => {
            if (!acc[message.qrCodeId]) {
              acc[message.qrCodeId] = [];
            }
            acc[message.qrCodeId].push(message);
            return acc;
          },
          {}
        );

        // Transform the grouped object into an array
        const mappedMessages = Object.entries(messagesGroupedByQrCodeId).map(
          ([qrCodeId, messages]: [string, Message[]]) => ({
            qrCodeId,
            messages,
            itemName: messages[0]?.qrCode?.itemName || null,
            itemDetails: messages[0]?.qrCode?.itemDetails || null, // Use the itemName from the first message
          })
        );

        // Create userChats from mappedMessages
        this.userChats = mappedMessages.map((chat, index) => ({
          id: (index + 1).toString(),
          qrCodeId: chat.qrCodeId,
          messages: chat.messages,
          itemName: chat.itemName,
          itemDetails: chat.itemDetails, // Include itemName in userChats if needed
        }));
      }
    });
  }

  onDeleteChat(chat: Chat) {}
}
