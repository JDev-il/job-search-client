/**
 * Facts shown on the public Privacy Policy and Terms of Service pages.
 *
 * `contactEmail` must stay a mailbox that is actually monitored: the privacy
 * policy has to give users a real way to reach whoever runs the service (and
 * Google's consent screen review expects the same).
 */
export const LEGAL = {
  appName: 'CV Tracker',
  appUrl: 'https://cv-tracker.wedevz.io',
  operator: 'WeDevz',
  contactEmail: 'jonathan@wedevz.io',
  lastUpdated: 'November 2, 2026',
} as const;

export const GOOGLE_USER_DATA_POLICY_URL = 'https://developers.google.com/terms/api-services-user-data-policy';
export const GOOGLE_PERMISSIONS_URL = 'https://myaccount.google.com/permissions';
