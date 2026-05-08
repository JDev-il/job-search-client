import { Injectable } from '@angular/core';
import { CONSENT_DECLINED_KEY } from '../constants/aliases';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class WindowService {
  constructor(private readonly stateService: StateService) { }

  public openGmailConnect(url: string): void {
    window.open(url, 'gmail-oauth', 'width=480,height=640,left=750,top=250');
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === 'gmail-connected') {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(CONSENT_DECLINED_KEY);
        }
        this.stateService._gmailEmail.set(event.data.email);
        this.stateService._gmailConsent.set(true);
        window.removeEventListener('message', onMessage);
      }
    };
    window.addEventListener('message', onMessage);
  }
}
