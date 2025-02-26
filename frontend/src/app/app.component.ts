import { Component, ElementRef, ViewChild } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { Observable } from 'rxjs';
import { Message } from './message';
import { MessagesService } from './messages.service';
import { AsyncPipe } from '@angular/common';
import { MessageComponent } from './message/message.component';
import {MatSlideToggleChange, MatSlideToggleModule} from '@angular/material/slide-toggle';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { ISubscription } from '@microsoft/signalr';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-root',
  imports: [
    AsyncPipe,
    MatToolbarModule,
    MatIconModule,
    MessageComponent,
    MatSlideToggleModule,
    CdkTextareaAutosize,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';

  constructor(private messagesService: MessagesService,

  ) {
    this.messages$ = messagesService.getMessages();
  }

  @ViewChild('main') mainElement!: ElementRef;

  messages$: Observable<Message[]>;
  newMessage: string = '';
  newMessages: Message[] = [];
  currentAssistantMessage: Message | null = null;
  isStreaming = false;

  private stream: ISubscription<string> | null = null;

  async sendMessage() {
    console.log('sendMessage');
    const newMessage = this.newMessage;
    this.newMessage = '';
    let addedMessage = await this.messagesService.addMessage(newMessage, 'User');
    this.newMessages.push(addedMessage);
    addedMessage = await this.messagesService.addMessage('', 'Assistant');
    this.newMessages.push(addedMessage);
    this.currentAssistantMessage = addedMessage;
    await this.handleStream(newMessage);
  }

  async updateMessage(message: Message) {
    await this.messagesService.updateMessage(message);
  }

  onModeChanged(arg: MatSlideToggleChange) {
    const element = document.getElementsByTagName('html')[0];
    element.classList.remove(arg.checked ? 'light' : 'dark');
    element.classList.add(arg.checked ? 'dark' : 'light');
  }

  async handleStream(message: string) {
    console.log('handle stream');
    const stream = await this.messagesService.receiveResponse(message);
    this.isStreaming = true;
    this.stream = stream.subscribe({
      next: (m: string) => {
        console.log('next');
        if(this.currentAssistantMessage)
          this.currentAssistantMessage.content = m;
      },
      error: (error) => {
        console.log(error);
        this.isStreaming = false;
      },
      complete: () => this.isStreaming = false
    })
  }

  cancelMessage() {
    this.messagesService.cancelMessage();
  }

  ngAfterViewInit() {
    this.mainElement.nativeElement.scrollTop = 
      this.mainElement.nativeElement.scrollHeight;
  }

  ngOnDestroy() {
    if(this.stream)
      this.stream.dispose();
    this.messagesService.closeConnection();
  }
}
