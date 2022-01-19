import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreOwnerDetailComponent } from './store-owner-detail.component';

describe('StoreOwnerDetailComponent', () => {
  let component: StoreOwnerDetailComponent;
  let fixture: ComponentFixture<StoreOwnerDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreOwnerDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreOwnerDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
