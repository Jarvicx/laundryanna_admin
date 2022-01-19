import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreOwnerAddEditComponent } from './store-owner-add-edit.component';

describe('StoreOwnerAddEditComponent', () => {
  let component: StoreOwnerAddEditComponent;
  let fixture: ComponentFixture<StoreOwnerAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreOwnerAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreOwnerAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
