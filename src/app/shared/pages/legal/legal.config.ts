/**
 * Facts shown on the public Privacy Policy and Terms of Service pages.
 *
 * TODO before this ships: confirm `operator` and set `contactEmail` to a
 * mailbox that is actually monitored. The privacy policy has to give users a
 * real way to reach whoever runs the service (and Google's consent screen
 * review expects the same).
 */
export const LEGAL = {
  appName: 'CV Tracker',
  appUrl: 'https://cv-tracker.wedevz.io',
  operator: 'WeDevz',
  contactEmail: 'TODO-set-contact-email@example.com',
  lastUpdated: 'November 2, 2026',
} as const;

export const GOOGLE_USER_DATA_POLICY_URL = 'https://developers.google.com/terms/api-services-user-data-policy';
export const GOOGLE_PERMISSIONS_URL = 'https://myaccount.google.com/permissions';
