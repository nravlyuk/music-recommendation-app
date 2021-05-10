import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeniusSearchComponent } from './genius-search.component';

describe('GeniusSearchComponent', () => {
  let component: GeniusSearchComponent;
  let fixture: ComponentFixture<GeniusSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeniusSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeniusSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
