import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreGeofencingComponent } from './store-geofencing.component';

describe('StoreGeofencingComponent', () => {
  let component: StoreGeofencingComponent;
  let fixture: ComponentFixture<StoreGeofencingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreGeofencingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreGeofencingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
