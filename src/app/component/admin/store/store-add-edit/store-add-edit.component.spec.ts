import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAddEditComponent } from './store-add-edit.component';

describe('StoreAddEditComponent', () => {
  let component: StoreAddEditComponent;
  let fixture: ComponentFixture<StoreAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
