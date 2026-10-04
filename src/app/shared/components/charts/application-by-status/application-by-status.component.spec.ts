import { ComponentFixture, TestBed } from '@angular/core/testing';

// `describe`/`beforeEach` come from Jasmine's own test globals (loaded by
// the Karma/esbuild test builder) — importing them from Node's built-in
// `node:test` module instead shadowed those globals and broke the bundle
// (the browser build can't resolve `node:test`).
import { ApplicationByStatusComponent } from './application-by-status.component';

describe('ApplicationByStatusComponent', () => {
  let component: ApplicationByStatusComponent;
  let fixture: ComponentFixture<ApplicationByStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApplicationByStatusComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ApplicationByStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
