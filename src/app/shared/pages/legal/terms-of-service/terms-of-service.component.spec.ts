import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LEGAL } from '../legal.config';
import { TermsOfServiceComponent } from './terms-of-service.component';

describe('TermsOfServiceComponent', () => {
  let fixture: ComponentFixture<TermsOfServiceComponent>;
  let page: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsOfServiceComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TermsOfServiceComponent);
    fixture.detectChanges();
    page = fixture.nativeElement;
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
    expect(page.querySelector('h1')?.textContent).toContain('Terms of Service');
  });

  it('names the operator and links to the privacy policy', () => {
    expect(page.textContent).toContain(LEGAL.operator);
    expect(page.querySelector('a[href="/privacy"]')).not.toBeNull();
  });
});
