import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ApiConfigService } from '../../../core/services/configuration.service';

@Component({
  selector: 'app-google',
  imports: [MatButtonModule],
  templateUrl: './google.component.html',
  styleUrl: './google.component.scss',
})
export class GoogleComponent {
  private platformId = inject(PLATFORM_ID);
  private apiConfig = inject(ApiConfigService);

  public signInWithGoogle(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.location.href = this.apiConfig.buildInternalUrl(
        this.apiConfig.internal.auth.path,
        this.apiConfig.internal.auth.google
      );
    }
  }
}
