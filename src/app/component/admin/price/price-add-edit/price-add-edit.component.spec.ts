import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceAddEditComponent } from './price-add-edit.component';

describe('PriceAddEditComponent', () => {
  let component: PriceAddEditComponent;
  let fixture: ComponentFixture<PriceAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriceAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
