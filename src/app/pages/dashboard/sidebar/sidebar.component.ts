import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  menuItems = [
    { title: 'Pepper', icon: 'local_florist', route: '/pepper' },
    { title: 'Salt', icon: 'waves', route: '/salt' },
    { title: 'Paprika', icon: 'whatshot', route: '/paprika' },
  ];
}
