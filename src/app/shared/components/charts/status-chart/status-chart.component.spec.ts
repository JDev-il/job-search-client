import { ComponentFixture, TestBed } from '@angular/core/testing';

// `describe`/`beforeEach` come from Jasmine's own test globals (loaded by
// the Karma/esbuild test builder) — importing them from Node's built-in
// `node:test` module instead shadowed those globals and broke the bundle
// (the browser build can't resolve `node:test`).
import { StatusChartComponent } from './status-chart.component';

describe('StatusChartComponent', () => {
  let component: StatusChartComponent;
  let fixture: ComponentFixture<StatusChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
