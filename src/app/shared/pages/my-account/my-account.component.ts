import { Component } from '@angular/core';
import { FaderDirective } from '../../directives/fader.directive';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [FaderDirective],
  templateUrl: './my-account.component.html',
  styleUrl: './my-account.component.scss'
})
export class MyAccountComponent {

}
