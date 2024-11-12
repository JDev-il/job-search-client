import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class RoutingService {

  constructor(private router: Router) { }

  public toDashboard(): void {
    this.router.navigate([''])
  }
  public toLogin(): void {
    this.router.navigate(['login'])
  }
  public toRegister(): void {
    this.router.navigate(['register'])
  }

}
