import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, Output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { NavBarLink } from '../../../../core/models/data.interface';
import { RoutingService } from '../../../services/routing.service';

@Component({
  selector: 'inner-navigation',
  imports: [MatIcon, RouterLink, CommonModule],
  templateUrl: './inner-navigation.component.html',
  styleUrl: './inner-navigation.component.scss',
})
export class InnerNavigationComponent {
  @Output() emitPath: EventEmitter<string> = new EventEmitter()
  private routingService = inject(RoutingService);
  private router = inject(Router);
  public links = input<NavBarLink[]>([]);

  public get navBarLinks(): NavBarLink[] {
    return this.links();
  }

  public isActive(route: string): boolean {
    return this.router.url.startsWith(`/${route}`) || this.router.url === route;
  }

  public navBarAction(route: NavBarLink): void {
    this.emitPath.emit(route.name.toLowerCase());
    if (route.name.toLowerCase() === 'data') {
      this.routingService.toInnerData();
    }
    if (route.name.toLowerCase() === 'actions') {
      this.routingService.toInnerActions();
    }
  }
}
