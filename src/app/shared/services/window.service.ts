import { Injectable } from '@angular/core';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class WindowService {
  constructor(private readonly stateService: StateService) { }

  public openGmailConnect(url: string): void {
    window.open(url, 'gmail-connect', 'width=500,height=600');
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'gmail-connected') {
        this.stateService._gmailEmail.set(event.data.email);
        window.removeEventListener('message', onMessage);
      }
    };
    window.addEventListener('message', onMessage);
  }
}
