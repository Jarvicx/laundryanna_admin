import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBoyCalendarComponent } from './service-boy-calendar.component';

describe('ServiceBoyCalendarComponent', () => {
  let component: ServiceBoyCalendarComponent;
  let fixture: ComponentFixture<ServiceBoyCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceBoyCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBoyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
