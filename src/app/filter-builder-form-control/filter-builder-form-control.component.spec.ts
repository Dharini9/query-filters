import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterBuilderFormControlComponent } from './filter-builder-form-control.component';

describe('FilterBuilderFormControlComponent', () => {
  let component: FilterBuilderFormControlComponent;
  let fixture: ComponentFixture<FilterBuilderFormControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterBuilderFormControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterBuilderFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
