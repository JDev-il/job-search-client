import { ComponentFixture, TestBed } from '@angular/core/testing';

import { beforeEach, describe } from 'node:test';
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
});
