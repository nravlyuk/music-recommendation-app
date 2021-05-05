import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IgnoredComponent } from './ignored.component';

describe('IgnoredComponent', () => {
  let component: IgnoredComponent;
  let fixture: ComponentFixture<IgnoredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IgnoredComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IgnoredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
