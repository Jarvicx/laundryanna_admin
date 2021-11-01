import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBoyAddComponent } from './service-boy-add.component';

describe('ServiceBoyAddComponent', () => {
  let component: ServiceBoyAddComponent;
  let fixture: ComponentFixture<ServiceBoyAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServiceBoyAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceBoyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
