import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private isAuthenticated$ = signal<boolean>(false);

  constructor(private router: Router) {
    this.isAuthenticated$.set(this.hasToken());
  }

  // Login method, which sets the token in localStorage and updates the signal
  public loginValidation(): void {
    if (this.isLocalStorage) {
      localStorage.setItem('authToken', 'TEMP');
      this.isAuthenticated$.set(true);
    }
  }

  // Logout method, which removes the token and updates the signal
  public logout(): void {
    if (this.isLocalStorage) {
      localStorage.removeItem('authToken');
      this.isAuthenticated$.set(false);
    }
  }

  private hasToken(): boolean {
    if (this.isLocalStorage) {
      const token = localStorage.getItem('authToken');
      return token !== null;
    }
    return false;
  }

  // Getter to expose the authentication status
  public get isAuthenticated(): boolean {
    const hasToken = this.hasToken();
    this.isAuthenticated$.set(hasToken);
    return this.isAuthenticated$();
  }

  private get isLocalStorage(): boolean {
    return typeof localStorage !== 'undefined'
  }

}
