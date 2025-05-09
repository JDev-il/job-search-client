import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketAnalystComponent } from './market-analyst.component';

describe('MarketAnalystComponent', () => {
  let component: MarketAnalystComponent;
  let fixture: ComponentFixture<MarketAnalystComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketAnalystComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarketAnalystComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
