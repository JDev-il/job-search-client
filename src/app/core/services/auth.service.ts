import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated$ = signal<boolean>(false);

  constructor() {
    const tokenExists = !!this.getToken();
    this.isAuthenticated$.set(tokenExists);
  }

  public setAuthentication(state: boolean): void {
    this.isAuthenticated$.set(state);
  }

  public setToken(token: string): void {
    if (this.isLocalStorage) {
      localStorage.setItem('authToken', token);
      this.setAuthentication(true);
    }
  }

  public getToken(): string | null {
    return this.isLocalStorage ? localStorage.getItem('authToken') : null;
  }

  public logout(): void {
    if (this.isLocalStorage) {
      localStorage.removeItem('authToken');
      this.setAuthentication(false);
    }
  }

  public get isAuthenticated(): boolean {
    const tokenExists = !!this.getToken();
    const signalState = this.isAuthenticated$();
    if (tokenExists && !signalState) {
      this.isAuthenticated$.set(true);
    }
    return tokenExists || signalState;
  }

  private get isLocalStorage(): boolean {
    return typeof localStorage !== 'undefined';
  }
}
