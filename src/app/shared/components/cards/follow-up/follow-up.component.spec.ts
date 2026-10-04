import { ComponentFixture, TestBed } from '@angular/core/testing';

// `describe`/`beforeEach` come from Jasmine's own test globals (loaded by
// the Karma/esbuild test builder) — importing them from Node's built-in
// `node:test` module instead shadowed those globals and broke the bundle
// (the browser build can't resolve `node:test`).
import { FollowUpComponent } from './follow-up.component';

describe('FollowUpComponent', () => {
  let component: FollowUpComponent;
  let fixture: ComponentFixture<FollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
