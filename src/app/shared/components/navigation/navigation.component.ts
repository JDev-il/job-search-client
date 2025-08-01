import { CommonModule } from '@angular/common';
import { Component, effect, HostListener, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
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
  styleUrls: ['./navigation.component.scss', '../../style/custom-material.scss'],
})
export class NavigationComponent {
  private navigationHistory: WritableSignal<{}> = signal({});
  public isWindowMobile: WritableSignal<boolean> = signal(false);
  public isDrawerOpened: WritableSignal<boolean> = signal(true);
  public icons: Record<string, SafeResourceUrl> = {};
  constructor(private routingService: RoutingService, private authService: AuthService, private uiService: UIService) {
    this.updateViewportWidth();
    effect(() => {
      this.isWindowMobile() ? this.isDrawerOpened.set(false) : this.isDrawerOpened.set(true);
    }, { allowSignalWrites: true })
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateViewportWidth();
  }

  public get navBarLinks(): NavBarLink[] {
    return this.uiService.navBarLinks;
  }

  public isActive(route: string): boolean {
    return this.routingService.checkIsActive(route);
  }

  public navBarAction(route: string): void {
    if (route === 'logout') {
      this.authService.logout();
      this.routingService.toLogin();
    }
    if (route === 'account') {
      this.routingService.toAccount();
    } else {

    }
  }

  public openDrawer(drawer: MatDrawer) {
    drawer.toggle();
    this.isDrawerOpened.set(drawer.opened);
  }

  private updateViewportWidth(): void {
    const width = window.innerWidth;
    this.isWindowMobile.set(width <= 1280);
  }
}
