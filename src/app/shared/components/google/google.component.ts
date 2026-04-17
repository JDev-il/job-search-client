import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';
import { ApiConfigService } from '../../../core/services/configuration.service';

@Component({
  selector: 'app-google',
  imports: [MatButtonModule],
  templateUrl: './google.component.html',
  styleUrl: './google.component.scss',
})
export class GoogleComponent {
  private authService = inject(AuthService);
  private apiConfig = inject(ApiConfigService);

  public signInWithGoogle(): void {
    if (this.authService.isBrowser) {
      window.location.href = this.apiConfig.buildInternalUrl(
        this.apiConfig.internal.auth.path,
        this.apiConfig.internal.auth.google
      );
    }
  }
}
