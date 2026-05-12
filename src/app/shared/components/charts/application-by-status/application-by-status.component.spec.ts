import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe } from 'node:test';
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
});
