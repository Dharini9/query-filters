import { Component, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BuilderFieldDataSource, FieldDataSource } from '../constants';

@Component({
  selector: 'app-filter-builder-form-control',
  templateUrl: './filter-builder-form-control.component.html',
  styleUrls: ['./filter-builder-form-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: FilterBuilderFormControlComponent
    }
  ]
})
export class FilterBuilderFormControlComponent implements OnInit, ControlValueAccessor {

  controlValue: number | string;
  onChange = (controlValue) => {};
  onTouched = () => {};
  touched = false;
  disabled = false;
  fieldDataSource: FieldDataSource[];

  constructor() { }

  ngOnInit(): void {
    this.fieldDataSource = BuilderFieldDataSource;
  }

  onValueChanged($event) {
    this.markAsTouched();
    if ($event && !this.disabled) {
      this.controlValue = $event.value;
      this.onChange(this.controlValue);
    }
  }

  writeValue(value: number | string) {
    this.controlValue = value;
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

}
