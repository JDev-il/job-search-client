import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { FaderDirective } from '../../directives/fader.directive';
import { StateService } from '../../services/state.service';
import { WindowService } from '../../services/window.service';

@Component({
  selector: 'app-my-account',
  imports: [FaderDirective, MatButtonModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class AccountComponent implements OnInit {

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private stateService: StateService,
    private windowService: WindowService
  ) { }

  public get gmailEmail(): string | null {
    return this.stateService._gmailEmail();
  }

  ngOnInit(): void {
    if (!this.authService.isBrowser) return;
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
    if (!this.authService.isBrowser) return;
    const token = this.authService.getToken();
    if (token) {
      this.apiService.getGmailUrlReq(token).subscribe(res => {
        this.windowService.openGmailConnect(res.url);
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
