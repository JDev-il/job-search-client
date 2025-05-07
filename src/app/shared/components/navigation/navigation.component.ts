import { CommonModule } from '@angular/common';
import { Component, HostListener, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatSelectModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatTooltipModule,
    CommonModule
  ],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss',
})
export class NavigationComponent {
  public isDrawerOpened: boolean = true;
  public isWindowMobile: WritableSignal<boolean> = signal(false);
  public icons: Record<string, SafeResourceUrl> = {};
  constructor(private router: Router, private routingService: RoutingService, private authService: AuthService, private uiService: UIService) { }

  @HostListener('window:resize', ['$event'])
  onResize(e: Event) {
    const window = e.target as Window;
    if (window.innerWidth <= 1280) {
      this.isWindowMobile.set(true);
    } else {
      this.isWindowMobile.set(false);
    }

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

  openDrawer(drawer: MatDrawer) {
    drawer.toggle();
    this.isDrawerOpened = drawer.opened;
  }
}
