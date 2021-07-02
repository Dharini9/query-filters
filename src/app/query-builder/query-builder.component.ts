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
  fieldDataSource: FieldDataSource[];
  queryBuilderForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.operationDataSource = BuilderOperationDataSource;
    this.operatorDataSource = BuilderOperatorDataSource;
    this.fieldDataSource = BuilderFieldDataSource;

    this.queryBuilderForm = this.formBuilder.group({
      title: 'Builder_FormData',
      items: this.formBuilder.array([this.formBuilder.group(this.createFormItems())])
    });
  }

  createFormItems(operation = 0, field = '', operator = 0, value = ''): BuilderFormItems {
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

  addNewItem(e) {
    this.formItems.push(this.formBuilder.group(this.createFormItems()));
  }

}
