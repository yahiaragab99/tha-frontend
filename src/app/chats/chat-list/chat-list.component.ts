import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonList } from '@ionic/angular/standalone';
import { ChatObjectComponent } from '../chat-object/chat-object.component';
import { Chat } from 'src/app/models/chat.model';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  standalone: true,
  imports: [IonList, ChatObjectComponent],
})
export class ChatListComponent {
  @Input() userChats: Chat[] = [];
  @Output() delete = new EventEmitter<Chat>();

  chats!: Chat[];
  constructor() {}

  onDelete(chat: Chat) {
    this.delete.emit(chat);
  }
}
