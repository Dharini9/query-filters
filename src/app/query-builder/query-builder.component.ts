import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { BuilderFieldDataSource, BuilderFormItems, BuilderOperationDataSource, BuilderOperatorDataSource, FieldDataSource, OperationDataSource, OperatorDataSource } from '../constants';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class QueryBuilderComponent implements OnInit {

  operationDataSource: OperationDataSource[];
  operatorDataSource: OperatorDataSource[];
  availableOperatorDataSource: OperatorDataSource[];
  defaultSelectedOperatorID = 1;
  defaultSelectedOperationID = 1;
  fieldDataSource: FieldDataSource[];
  queryBuilderForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.operationDataSource = BuilderOperationDataSource;
    this.operatorDataSource = BuilderOperatorDataSource;
    this.fieldDataSource = BuilderFieldDataSource;

    this.getAvailableOperators(this.defaultSelectedOperatorID);

    this.queryBuilderForm = this.formBuilder.group({
      title: 'Builder_FormData',
      items: this.formBuilder.array([this.formBuilder.group(this.createFormItems())])
    });
  }

  createFormItems(operation = this.defaultSelectedOperationID, field = '', operator = this.defaultSelectedOperatorID, value = ''): BuilderFormItems {
    return {
      IsCheckedForGrouping: new FormControl(false),
      Operation: new FormControl(operation),
      Field: new FormControl(field),
      Operator: new FormControl(operator),
      QueryValue: new FormControl(value)
    };
  }

  get formItems() {
    return this.queryBuilderForm.get('items') as FormArray;
  }

  removeItem(index) {
    this.formItems.removeAt(index);
  }

  addNewItem() {
    this.formItems.push(this.formBuilder.group(this.createFormItems()));
  }

  addItem(index) {
    /**
     * The splice() function is the only native array function that lets you add elements to the middle of an array.
     * Every parameter to splice() after the deleteCount parameter is treated as an element to add to the array at the startIndex.
     */
    this.formItems.controls.splice(index + 1, 0, this.formBuilder.group(this.createFormItems()));
  }

  valueSelectionAccordingToFieldSelected(index) {
    return (<FormArray>this.queryBuilderForm.get('items')).at(index).value;
  }

  getAvailableOperators(operatorIdentifier: number | string) {
    if (typeof(operatorIdentifier) === 'number') {
      this.availableOperatorDataSource = this.operatorDataSource.filter(operator => operator.OperatorID === operatorIdentifier);
    } else {
      this.availableOperatorDataSource = this.operatorDataSource.filter(operator => operator.FieldTypeIDs.includes(operatorIdentifier));
    }
  }

  onFieldOptionChanged($event) {
    if ($event && $event.value) {
      this.getAvailableOperators($event.value);
    }
  }

}
