import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { FaderDirective } from '../../directives/fader.directive';
import { DataService } from '../../services/data.service';
import { WindowService } from '../../services/window.service';

@Component({
  selector: 'app-my-account',
  imports: [FaderDirective, MatButtonModule],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class AccountComponent implements OnInit {
  public accountName = signal<string>('Account');
  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private windowService: WindowService
  ) { }

  public get gmailEmail(): string | null {
    return this.dataService.isGmailState();
  }

  ngOnInit(): void {
    if (!this.authService.isBrowser) return;
    this.accountName.set(this.dataService.userData().firstName);
  }

  public gmailConnect(): void {
    if (!this.authService.isBrowser) return;
    this.dataService.connectGmail().subscribe(res => {
      this.windowService.openGmailConnect(res.url);
    });
  }

  public gmailDisconnect(): void {
    this.dataService.disconnectGmail().subscribe();
  }
}
