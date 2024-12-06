import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentralHubComponent } from './central-hub.component';

describe('CentralHubComponent', () => {
  let component: CentralHubComponent;
  let fixture: ComponentFixture<CentralHubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentralHubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentralHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
