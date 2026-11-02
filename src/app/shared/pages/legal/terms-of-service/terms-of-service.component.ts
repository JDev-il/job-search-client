import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LEGAL } from '../legal.config';

@Component({
  selector: 'app-terms-of-service',
  imports: [RouterLink],
  templateUrl: './terms-of-service.component.html',
  styleUrl: '../legal-page.scss',
})
export class TermsOfServiceComponent {
  protected readonly legal = LEGAL;
}
