import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingUpdateComponent } from './setting-update.component';

describe('SettingUpdateComponent', () => {
  let component: SettingUpdateComponent;
  let fixture: ComponentFixture<SettingUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
