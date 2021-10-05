import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSlotAddEditComponent } from './time-slot-add-edit.component';

describe('TimeSlotAddEditComponent', () => {
  let component: TimeSlotAddEditComponent;
  let fixture: ComponentFixture<TimeSlotAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimeSlotAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeSlotAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
