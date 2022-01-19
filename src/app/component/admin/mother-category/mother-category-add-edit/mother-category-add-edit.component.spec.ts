import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherCategoryAddEditComponent } from './mother-category-add-edit.component';

describe('MotherCategoryAddEditComponent', () => {
  let component: MotherCategoryAddEditComponent;
  let fixture: ComponentFixture<MotherCategoryAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotherCategoryAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotherCategoryAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
