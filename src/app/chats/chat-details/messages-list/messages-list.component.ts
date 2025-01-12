import { Component, Input, OnInit } from '@angular/core';
import { IonList } from '@ionic/angular/standalone';
import { MessagesObjectComponent } from '../messages-object/messages-object.component';

@Component({
  selector: 'app-messages-list',
  templateUrl: './messages-list.component.html',
  styleUrls: ['./messages-list.component.scss'],
  standalone: true,
  imports: [IonList, MessagesObjectComponent],
})
export class MessagesListComponent implements OnInit {
  @Input() messages: any[] = [];
  constructor() {}

  ngOnInit() {
    this.messages = this.messages.map((message) => {
      return {
        ...message,
        createdAt: new Date(message.createdAt).toLocaleString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }),
      };
    });
  }
}
