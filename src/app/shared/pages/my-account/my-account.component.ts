import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { FaderDirective } from '../../directives/fader.directive';
import { StateService } from '../../services/state.service';

@Component({
  selector: 'app-my-account',
  imports: [FaderDirective, MatButtonModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class AccountComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private stateService: StateService
  ) { }

  public get gmailEmail(): string | null {
    return this.stateService._gmailEmail();
  }

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const token = this.authService.getToken();
    if (token) {
      this.apiService.getGmailStatusReq(token).pipe(
        catchError(err => {
          console.error('[gmail/status] failed', err);
          return of({ gmailEmail: null as string | null });
        })
      ).subscribe(res => {
        this.stateService._gmailEmail.set(res.gmailEmail);
      });
    }
  }

  public connectGmail(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const token = this.authService.getToken();
    if (token) {
      this.apiService.getGmailUrlReq(token).subscribe(res => {
        window.location.href = res.url;
      });
    }
  }

  public disconnectGmail(): void {
    const token = this.authService.getToken();
    if (token) {
      this.apiService.disconnectGmailReq(token).subscribe(() => {
        this.stateService._gmailEmail.set(null);
      });
    }
  }
}
