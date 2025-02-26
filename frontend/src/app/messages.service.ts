import { Injectable } from '@angular/core';
import { Message } from './message';
import { first, map, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private httpClient: HttpClient) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.serviceUrl}hubs/messages`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .build();
  }

  private serviceUrl = 'http://localhost:5037/';
  private hubConnection: signalR.HubConnection;

  private mapMessage(message: Message): Message {
    if(typeof(message.added) === 'string')
      return {
        ...message,
        added: new Date(message.added)
      };
    return message;
  }

  getMessages(): Observable<Message[]> {
    return this.httpClient.get<Message[]>(`${this.serviceUrl}api/messages`)
      .pipe(map(messages => messages.map(m => this.mapMessage(m))));
  }

  addMessage(content: string, author: 'User' | 'Assistant'): Promise<Message> {
    return new Promise((resolve, reject) => {
      this.httpClient.post<Message>(`${this.serviceUrl}api/messages`, { content, author })
        .pipe(first(), map(m => this.mapMessage(m)))
        .subscribe(m => resolve(m));
    });
  }

  updateMessage(message: Message) {
    return new Promise((resolve, reject) => {
      this.httpClient.patch<Message>(`${this.serviceUrl}api/messages`, message)
        .pipe(first(), map(m => this.mapMessage(m)))
        .subscribe(m => resolve(m));
    });
  }

  async cancelMessage() {
    this.hubConnection.invoke('CancelMessage');
  }

  async receiveResponse(message: string): Promise<signalR.IStreamResult<string>> {
    if(this.hubConnection.state != 'Connected')
      await this.hubConnection.start();
    return this.hubConnection.stream('Message', message);
  }

  async closeConnection(): Promise<boolean> {
    if(this.hubConnection.state != 'Connected')
      return false;
    await this.hubConnection.stop();
    return true;
  }
}
