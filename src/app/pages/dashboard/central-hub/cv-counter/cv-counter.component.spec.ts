import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvCounterComponent } from './cv-counter.component';

describe('CvCounterComponent', () => {
  let component: CvCounterComponent;
  let fixture: ComponentFixture<CvCounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvCounterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CvCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
