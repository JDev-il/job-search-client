import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GOOGLE_PERMISSIONS_URL, GOOGLE_USER_DATA_POLICY_URL, LEGAL } from '../legal.config';

@Component({
  selector: 'app-privacy-policy',
  imports: [RouterLink],
  templateUrl: './privacy-policy.component.html',
  styleUrl: '../legal-page.scss',
})
export class PrivacyPolicyComponent {
  protected readonly legal = LEGAL;
  protected readonly googleUserDataPolicyUrl = GOOGLE_USER_DATA_POLICY_URL;
  protected readonly googlePermissionsUrl = GOOGLE_PERMISSIONS_URL;
}
