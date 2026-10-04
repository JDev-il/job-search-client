import { ComponentFixture, TestBed } from '@angular/core/testing';

// `describe`/`beforeEach` come from Jasmine's own test globals (loaded by
// the Karma/esbuild test builder) — importing them from Node's built-in
// `node:test` module instead shadowed those globals and broke the bundle
// (the browser build can't resolve `node:test`).
import { TimelineChartComponent } from './timeline-chart.component';

describe('TimelineChartComponent', () => {
  let component: TimelineChartComponent;
  let fixture: ComponentFixture<TimelineChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimelineChartComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TimelineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
