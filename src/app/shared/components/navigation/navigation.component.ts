import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatButtonModule],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.scss'
})
export class NavigationComponent {
  constructor(private router: Router) { }

  public isActive(route: string): boolean {
    return this.router.url === route;
  }

  public logout() {
    localStorage.removeItem('token');
    this.router.navigate(['login'])
  }
  public myAccount() {
    // Send request to server to recieve authorization token
  }
}
