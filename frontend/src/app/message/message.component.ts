import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Message } from '../message';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-message',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  @Input({ required: true })
  source!: Message;

  @Output()
  onUpdated = new EventEmitter<Message>();

  setReaction(reaction: string) {
    let n = '';
    switch(reaction) {
      case 'up':
        n = '👍';
        break;
      case 'down':
        n = '👎';
        break;
    }
    if(this.source.reaction === n)
      this.source.reaction = undefined;
    else
      this.source.reaction = n;
    this.onUpdated.emit(this.source);
  }

  getReaction() {
    switch(this.source.reaction) {
      case '👍':
        return 'thumb_up';
      case '👎':
        return 'thumb_down';
      default:
        return '';
    }
  }
}
