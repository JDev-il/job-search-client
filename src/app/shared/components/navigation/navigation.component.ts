import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router, RouterLink } from '@angular/router';
import { NavBarLink } from '../../../core/models/data.interface';
import { RoutingService } from '../../services/routing.service';
import { UIService } from '../../services/ui.service';
import { AuthService } from './../../../core/services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
    MatListModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  public icons: Record<string, SafeResourceUrl> = {};
  constructor(private router: Router, private routingService: RoutingService, private authService: AuthService, private uiService: UIService) {

  }

  public get navBarLinks(): NavBarLink[] {
    return this.uiService.navBarLinks;
  }

  public isActive(route: string): boolean {
    return this.router.url === `/${route}`;
  }

  public navBarAction(whereTo: string): void {
    switch (whereTo) {
      case 'logout':
        this.authService.logout();
        this.routingService.toLogin();
        break;
      case 'account':
        this.routingService.toAccount();
        break;
    }
  }
}
