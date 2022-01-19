import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreOwnerListComponent } from './store-owner-list.component';

describe('StoreOwnerListComponent', () => {
  let component: StoreOwnerListComponent;
  let fixture: ComponentFixture<StoreOwnerListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreOwnerListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreOwnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
