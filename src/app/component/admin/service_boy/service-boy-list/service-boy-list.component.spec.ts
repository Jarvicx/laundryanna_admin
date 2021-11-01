import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBoyListComponent } from './service-boy-list.component';

describe('ServiceBoyListComponent', () => {
  let component: ServiceBoyListComponent;
  let fixture: ComponentFixture<ServiceBoyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceBoyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBoyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
