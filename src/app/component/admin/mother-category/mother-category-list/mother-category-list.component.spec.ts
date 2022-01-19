import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotherCategoryListComponent } from './mother-category-list.component';

describe('MotherCategoryListComponent', () => {
  let component: MotherCategoryListComponent;
  let fixture: ComponentFixture<MotherCategoryListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MotherCategoryListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MotherCategoryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
