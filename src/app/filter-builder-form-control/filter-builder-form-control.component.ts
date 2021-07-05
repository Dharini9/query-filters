import { Component, forwardRef, Input, OnChanges, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { availableFields, availableFieldsControlTypes, BuilderFieldDataSource, defaultQueryValueForNoFields, DxDateBoxControlDateType, FieldDataSource } from '../constants';

@Component({
  selector: 'app-filter-builder-form-control',
  templateUrl: './filter-builder-form-control.component.html',
  styleUrls: ['./filter-builder-form-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: forwardRef(() => FilterBuilderFormControlComponent)
    }
  ]
})
export class FilterBuilderFormControlComponent implements OnInit, ControlValueAccessor, OnChanges {

  @Input() fieldTypeID: string;
  @Input() disabled: boolean;

  fieldDataSource: FieldDataSource[];
  currentQueryControl: FieldDataSource = defaultQueryValueForNoFields;
  availableFields = availableFields;
  availableFieldsControlTypes = availableFieldsControlTypes;

  controlValue: any;
  onChange = (controlValue) => {};
  onTouched = () => {};
  touched = false;

  constructor() { }

  ngOnInit(): void {
    this.fieldDataSource = BuilderFieldDataSource;
  }

  ngOnChanges(): void {
    console.log(this.fieldTypeID);
    if (this.fieldTypeID && this.fieldDataSource && this.fieldDataSource.length) {
      this.currentQueryControl = this.fieldDataSource.find(field => field.FieldTypeID === this.fieldTypeID);
    }
  }

  onValueChanged($event, fieldControlType) {
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
