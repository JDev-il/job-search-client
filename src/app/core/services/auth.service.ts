import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated$ = signal<boolean>(false);
  constructor() { }

  public setToken(token: string): void {
    if (this.isLocalStorage) {
      localStorage.setItem('authToken', token);
      this.isAuthenticated$.set(true);
    }
  }

  public getToken(): string | null {
    if (this.isLocalStorage) {
      const token = localStorage.getItem("authToken");
      return token;
    }
    return null;
  }

  public removeToken(): void {
    if (this.isLocalStorage) {
      localStorage.removeItem('authToken')
    }
  }

  public logout(): void {
    if (this.isLocalStorage) {
      localStorage.removeItem('authToken');
      this.isAuthenticated$.set(false);
    }
  }

  public get isAuthenticated(): boolean {
    return (typeof this.isLocalStorage && !!this.getToken()) || this.isAuthenticated$();
  }

  private get isLocalStorage(): boolean {
    return typeof localStorage !== 'undefined'
  }
}
