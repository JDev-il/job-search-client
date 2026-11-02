import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { GOOGLE_USER_DATA_POLICY_URL, LEGAL } from '../legal.config';
import { PrivacyPolicyComponent } from './privacy-policy.component';

describe('PrivacyPolicyComponent', () => {
  let fixture: ComponentFixture<PrivacyPolicyComponent>;
  let page: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyComponent);
    fixture.detectChanges();
    page = fixture.nativeElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(page.querySelector('h1')?.textContent).toContain('Privacy Policy');
  });

  // The disclosures Google's review and the app's actual behaviour depend on:
  // deleting any of these should be a deliberate, test-breaking decision.
  it('discloses read-only Gmail access, the OpenAI transfer and the Limited Use commitment', () => {
    const text = page.textContent ?? '';
    expect(text).toContain('gmail.readonly');
    expect(text).toContain('cannot send, delete or change');
    expect(text).toContain('OpenAI');
    expect(text).toContain('Limited Use requirements');
    expect(text).toContain('do not sell');
  });

  it('links to Google\'s API Services User Data Policy', () => {
    const link = Array.from(page.querySelectorAll('a')).find((a) =>
      a.textContent?.includes('Google API Services User Data Policy'));
    expect(link?.getAttribute('href')).toBe(GOOGLE_USER_DATA_POLICY_URL);
  });

  it('shows the contact address as a mailto link', () => {
    const mail = page.querySelector(`a[href="mailto:${LEGAL.contactEmail}"]`);
    expect(mail).not.toBeNull();
  });

  it('links to the terms', () => {
    expect(page.querySelector('a[href="/terms"]')).not.toBeNull();
  });
});
