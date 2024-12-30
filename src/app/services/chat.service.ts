import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Chat } from '../models/chat.model';
import { BehaviorSubject } from 'rxjs';

const API_BASE_URL = environment.serverUrl + '/message';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  authService = inject(AuthService);
  http = inject(HttpClient);

  selectedChat = new BehaviorSubject<Chat | null>(null);

  constructor() {}

  getUserChats(userId?: string | null) {
    return this.http.get(API_BASE_URL + '/user/' + userId);
  }

  setSelectedChat(chat: Chat) {
    this.selectedChat.next(chat);
  }

  getSelectedChat() {
    return this.selectedChat.getValue();
  }
}
