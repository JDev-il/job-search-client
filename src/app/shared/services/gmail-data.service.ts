import { computed, inject, Injectable, signal } from '@angular/core';
import { GmailMessage } from '../../core/models/gmail.interface';
import { StateService } from './state.service';

@Injectable({ providedIn: 'root' })
export class GmailDataService {
  private stateService = inject(StateService);
  private readonly _messages = signal<GmailMessage[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  public readonly messages = this._messages.asReadonly();
  public readonly loading = this._loading.asReadonly();
  public readonly error = this._error.asReadonly();

  public readonly unreadCount = computed(() =>
    this._messages().filter(m => m.unread).length
  );

  public readonly byThread = computed(() => {
    const map = new Map<string, GmailMessage[]>();
    for (const m of this._messages()) {
      const list = map.get(m.threadId) ?? [];
      list.push(m);
      map.set(m.threadId, list);
    }
    return map;
  });

  public setMessages(messages: GmailMessage[]) {
    this._messages.set(messages);
  }

  public addMessage(message: GmailMessage) {
    this._messages.update(list => [...list, message]);
  }

  public markAsRead(id: string) {
    this._messages.update(list =>
      list.map(m => m.id === id ? { ...m, unread: false } : m)
    );
  }

  public clear() {
    this._messages.set([]);
    this._error.set(null);
  }
}
