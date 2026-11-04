import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LegalLinksComponent } from './legal-links.component';

describe('LegalLinksComponent', () => {
  let fixture: ComponentFixture<LegalLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalLinksComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalLinksComponent);
    fixture.detectChanges();
  });

  it('links to the privacy policy and the terms', () => {
    const hrefs = Array.from(fixture.nativeElement.querySelectorAll('a')).map((a) => (a as HTMLAnchorElement).getAttribute('href'));
    expect(hrefs).toEqual(['/privacy', '/terms']);
  });
});
