import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { RoutingService } from '../../services/routing.service';
import { AuthService } from './../../../core/services/auth.service';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  constructor(private router: Router, private authServie: AuthService, private routingService: RoutingService) { }

  public isActive(route: string): boolean {
    return this.router.url === route;
  }

  public logout() {
    this.authServie.logout();
    this.routingService.toLogin();
  }
  public myAccount() {
    // Send request to server to recieve authorization token
  }
}
