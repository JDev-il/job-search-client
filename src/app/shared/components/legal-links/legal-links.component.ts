import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/** Privacy Policy / Terms links. Google expects the app's home page to link to its privacy policy. */
@Component({
  selector: 'app-legal-links',
  imports: [RouterLink],
  templateUrl: './legal-links.component.html',
  styleUrl: './legal-links.component.scss',
})
export class LegalLinksComponent { }
