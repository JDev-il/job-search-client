import { routes } from './app.routes';
import { PrivacyPolicyComponent } from './shared/pages/legal/privacy-policy/privacy-policy.component';
import { TermsOfServiceComponent } from './shared/pages/legal/terms-of-service/terms-of-service.component';

describe('app routes', () => {
  const find = (path: string) => routes.find((r) => r.path === path);

  // Google's consent screen links here for people who are not signed in, and
  // the protected shell redirects every signed-out visitor to /login.
  [
    { path: 'privacy', component: PrivacyPolicyComponent },
    { path: 'terms', component: TermsOfServiceComponent },
  ].forEach(({ path, component }) => {
    it(`serves /${path} to signed-out visitors`, async () => {
      const route = find(path);
      expect(route).toBeDefined();
      expect(route!.canActivate).toBeUndefined();
      expect(route!.canMatch).toBeUndefined();
      expect(await (route!.loadComponent as () => Promise<unknown>)()).toBe(component);
    });
  });

  it('matches the legal pages before the guarded shell and the catch-all', () => {
    const order = routes.map((r) => r.path);
    expect(order.indexOf('privacy')).toBeLessThan(order.indexOf(''));
    expect(order.indexOf('terms')).toBeLessThan(order.indexOf(''));
    expect(order.indexOf('privacy')).toBeLessThan(order.indexOf('**'));
  });
});
