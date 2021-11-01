import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PickUpAddEditComponent } from './pick-up-add-edit.component';

describe('PickUpAddEditComponent', () => {
  let component: PickUpAddEditComponent;
  let fixture: ComponentFixture<PickUpAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PickUpAddEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PickUpAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
