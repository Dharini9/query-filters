import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { availableFields, BuilderFieldDataSource, BuilderFormItems, BuilderOperationDataSource, BuilderOperatorDataSource, FieldDataSource, OperationDataSource, OperatorDataSource } from '../constants';
import { QueryBuilderService } from '../services/query-builder.service';

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
  defaultSelectedFieldID = 'skill';
  fieldDataSource: FieldDataSource[];
  queryBuilderForm: FormGroup;
  filterExpression = '';
  token;
  queryGroups = {};
  sortedQueryGroupsKeys = [];
  isReadyToCreateANewGroup = false;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private queryBuilderService: QueryBuilderService
  ) {
    this.getToken();
  }

  ngOnInit(): void {
    this.operationDataSource = BuilderOperationDataSource;
    this.operatorDataSource = BuilderOperatorDataSource;
    this.fieldDataSource = BuilderFieldDataSource;

    this.getAvailableOperators(this.defaultSelectedFieldID);

    this.queryBuilderForm = this.formBuilder.group({
      title: 'Builder_FormData',
      items: this.formBuilder.array([this.formBuilder.group(this.createFormItems())])
    });
  }

  getToken() {
    this.queryBuilderService.getToken().subscribe((result) => {
      this.token = result["access_token"];
      this.queryBuilderService.setToken(this.token);
    });
  }

  createFormItems(operation = this.defaultSelectedOperationID, field = this.defaultSelectedFieldID, operator = this.defaultSelectedOperatorID, value: any = []): BuilderFormItems {
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
    const existedQueryGroupForCurrentFormIndex: string[] = this.getExistedGroupForCurrentFormIndex(index);
    if (existedQueryGroupForCurrentFormIndex && existedQueryGroupForCurrentFormIndex.length) {
      existedQueryGroupForCurrentFormIndex.forEach(group => {
        this.queryGroups[group].pop();
        if (this.queryGroups[group] && this.queryGroups[group].length <= 1) {
          this.ungroupItems(group);
        }
      });
    }
    console.log('Query Group updated Created: ', this.queryGroups);
    this.sortQueryGroupsByTheirLength();
    this.generateFilterExpression();
    // this.checkForNewGroupBeCreated();
  }

  removeCreatedGroup(groupID: string) {
    this.ungroupItems(groupID);
    this.sortQueryGroupsByTheirLength();
    this.generateFilterExpression();
  }

  ungroupItems(groupID: string) {
    if (this.queryGroups && this.queryGroups[groupID]) {
      delete this.queryGroups[groupID];
    }
  }

  addNewItem() {
    this.formItems.push(this.formBuilder.group(this.createFormItems()));
  }

  addNewItemInExistingQuery(index) {
    /**
     * The splice() function is the only native array function that lets you add elements to the middle of an array.
     * Every parameter to splice() after the deleteCount parameter is treated as an element to add to the array at the startIndex.
     */
    this.formItems.controls.splice(index + 1, 0, this.formBuilder.group(this.createFormItems()));
    const existedQueryGroupForCurrentFormIndex: string[] = this.getExistedGroupForCurrentFormIndex(index);
    if (existedQueryGroupForCurrentFormIndex && existedQueryGroupForCurrentFormIndex.length) {
      existedQueryGroupForCurrentFormIndex.forEach(group => {
        this.queryGroups[group].push(this.queryGroups[group][this.queryGroups[group].length - 1] + 1);
        this.queryGroups[group].sort();
      });
    }
    this.sortQueryGroupsByTheirLength();
    this.generateFilterExpression();
    console.log('Query Group updated Created: ', this.queryGroups);
    // this.checkForNewGroupBeCreated();
  }

  moveCurrentQueryUp(formItemIndex: number) {
    if (this.getExistedGroupForCurrentFormIndex(formItemIndex - 1).length || this.getExistedGroupForCurrentFormIndex(formItemIndex).length) {
      alert('Cannot reordering item with group');
      return;
    }
    this.formItems.controls.splice(formItemIndex - 1, 2, this.getFormGroupItemFromQueryFormByIndex(formItemIndex), this.getFormGroupItemFromQueryFormByIndex(formItemIndex - 1));
    this.generateFilterExpression();
  }

  moveCurrentQueryDown(formItemIndex: number) {
    if (this.getExistedGroupForCurrentFormIndex(formItemIndex + 1).length || this.getExistedGroupForCurrentFormIndex(formItemIndex).length) {
      alert('Cannot reordering item with group');
      return;
    }
    this.formItems.controls.splice(formItemIndex, 2, this.getFormGroupItemFromQueryFormByIndex(formItemIndex + 1), this.getFormGroupItemFromQueryFormByIndex(formItemIndex));
    this.generateFilterExpression();
  }

  getQueryBuilderFormItemByIndexWithControlName(index: number, formControlName: string) {
    return (<FormArray>this.queryBuilderForm.get('items')).at(index).get(formControlName);
  }

  getValuesFromQueryFormControlByIndex(index: number) {
    return (<FormArray>this.queryBuilderForm.get('items')).at(index).value;
  }

  getFormGroupItemFromQueryFormByIndex(index: number) {
    return (<FormArray>this.queryBuilderForm.get('items')).at(index);
  }

  getAvailableOperators(operatorIdentifier: number | string) {
    if (typeof (operatorIdentifier) === 'number') {
      this.availableOperatorDataSource = this.operatorDataSource.filter(operator => operator.OperatorID === operatorIdentifier);
    } else {
      this.availableOperatorDataSource = this.operatorDataSource.filter(operator => operator.FieldTypeIDs.includes(operatorIdentifier));
    }
  }

  onFieldOptionChanged($event) {
    if ($event && $event.value) {
      this.getAvailableOperators($event.value);
      this.generateFilterExpression();
    }
  }

  onOperationOptionChanged($event) {
    this.generateFilterExpression();
  }

  onOperatorOptionChanged($event) {
    this.generateFilterExpression();
  }

  resetCheckBoxesForCreatingNewGroup(checkedItemIndexesForGrouping: number[] = []) {
    if (checkedItemIndexesForGrouping && checkedItemIndexesForGrouping.length) {
      checkedItemIndexesForGrouping.forEach(itemIndex => {
        this.getQueryBuilderFormItemByIndexWithControlName(itemIndex, 'IsCheckedForGrouping').setValue(false);
      });
    }
    this.isReadyToCreateANewGroup = false;
  }

  createNewGroup() {
    const checkedItemIndexesForGrouping: number[] = this.getIndexesOfItemsForGrouping() || [];
    if (this.checkIfNewGroupHasIntersectionSuperSetOrSubSet(checkedItemIndexesForGrouping)) {
      // this.queryGroups[`QueryGroup_${Object.keys(this.queryGroups).length}`] = checkedItemIndexesForGrouping;
      this.queryGroups[`QG_${Math.random().toString(36).slice(2)}`] = checkedItemIndexesForGrouping;
    } else {
      // alert('Error -> Group not created');
    }
    this.resetCheckBoxesForCreatingNewGroup(checkedItemIndexesForGrouping);
    this.sortQueryGroupsByTheirLength();
    this.generateFilterExpression();
    console.log('Group Created: ', this.queryGroups);
  }

  sortQueryGroupsByTheirLength() {
    const sortedQueryGroupsKeys = Object.entries(this.queryGroups)
      .sort(([, group1], [, group2]) => {
        return group2['length'] - group1['length'];
      })
      .reduce((reducedObject, [key, value]) => ({ ...reducedObject, [key]: value }), {});
    this.sortedQueryGroupsKeys = Object.keys(sortedQueryGroupsKeys);
    // this.sortedQueryGroupsKeys = JSON.parse(JSON.stringify(this.queryGroups));
    // const resuced = Object.keys(this.sortedQueryGroupsKeys)
    //   .sort((a1, a2) => this.sortedQueryGroupsKeys[a1]['length'] - this.sortedQueryGroupsKeys[a2]['length'])
    //   .reduce((arrayToReduce, item) => {
    //     arrayToReduce[item] = this.sortedQueryGroupsKeys[item]
    //     return arrayToReduce;
    //   }, {});
    console.log('-------------------sorted one: ', this.sortedQueryGroupsKeys);
  }

  getExistedGroupForCurrentFormIndex(formIndex: number) {
    const existedIndexGroup: string[] = [];
    if (this.queryGroups && Object.keys(this.queryGroups).length) {
      Object.keys(this.queryGroups).forEach(keyOfGroup => {
        if (this.queryGroups[keyOfGroup] && this.queryGroups[keyOfGroup].length) {
          if (this.queryGroups[keyOfGroup].includes(formIndex) && !existedIndexGroup.includes(keyOfGroup)) {
            existedIndexGroup.push(keyOfGroup);
          }
        }
      });
    }
    return existedIndexGroup;
  }

  checkIfNewGroupHasIntersectionSuperSetOrSubSet(checkedItemIndexesForGrouping: number[] = []) {
    let ifNewGroupBeCreated = true;
    if (this.queryGroups && Object.keys(this.queryGroups).length && checkedItemIndexesForGrouping.length) {
      for (const group of Object.keys(this.queryGroups)) {
        if (this.queryGroups[group] && this.queryGroups[group].length) {
          if (checkedItemIndexesForGrouping.every(item => this.queryGroups[group].includes(item)) &&
            this.queryGroups[group].every(item => checkedItemIndexesForGrouping.includes(item))) {
            alert('The group is already created');
            ifNewGroupBeCreated = false;
            return;
          } else if (this.queryGroups[group].every(item => checkedItemIndexesForGrouping.includes(item)) &&
            !checkedItemIndexesForGrouping.every(item => this.queryGroups[group].includes(item))) {
            // alert('New group is created as checkedItemIndexesForGrouping has some new members');
            ifNewGroupBeCreated = true;
          } else if (this.getArraysIntersection(checkedItemIndexesForGrouping, this.queryGroups[group]).length &&
            !checkedItemIndexesForGrouping.every(item => this.getArraysIntersection(checkedItemIndexesForGrouping, this.queryGroups[group]).includes(item))) {
            alert('Groups can not intersect each other.');
            ifNewGroupBeCreated = false;
            return;
          }
        }
      }
    }
    return ifNewGroupBeCreated;
  }

  getArraysIntersection(array1, array2): number[] {
    return array1.filter((item) => { return array2.indexOf(item) !== -1; });
  }

  getIndexesOfItemsForGrouping() {
    const checkedItemIndexesForGrouping: number[] = [];
    if (this.queryBuilderForm && this.queryBuilderForm.getRawValue() && this.queryBuilderForm.getRawValue().items) {
      const queryBuilderFormItems: BuilderFormItems[] = this.queryBuilderForm.getRawValue().items;
      queryBuilderFormItems.forEach((item, index) => {
        if (item.IsCheckedForGrouping) {
          checkedItemIndexesForGrouping.push(index);
        }
      });
    }
    return checkedItemIndexesForGrouping;
  }

  checkForNewGroupBeCreated() {
    const checkedItemIndexesForGrouping: number[] = this.getIndexesOfItemsForGrouping() || [];
    if (checkedItemIndexesForGrouping.length) {
      this.isReadyToCreateANewGroup = this.checkIfNewGroupBeCreated(checkedItemIndexesForGrouping, checkedItemIndexesForGrouping.length);
      if (this.isReadyToCreateANewGroup) {
        console.log('-------------- Group created');
      } else {
        console.log('groups not created');
      }
    }
  }

  checkIfNewGroupBeCreated(queryBuilderFormItems: number[], itemsLength, outerNumber = 0, innerNumber = outerNumber + 1) {
    if (outerNumber < itemsLength && innerNumber <= itemsLength) {
      if (queryBuilderFormItems[innerNumber] - queryBuilderFormItems[outerNumber] === 1) {
        if ((outerNumber + 1) === (itemsLength - 1)) {
          return queryBuilderFormItems[innerNumber] - queryBuilderFormItems[outerNumber] === 1;
        }
        return this.checkIfNewGroupBeCreated(queryBuilderFormItems, itemsLength, outerNumber + 1, innerNumber + 1);
      }
    }
    return false;
  }

  onGroupCreationCheckBoxChecked($event, index) {
    if ($event && $event.event) {
      this.checkForNewGroupBeCreated();
    }
  }

  onQueryValueChanged($event, index) {
    const formValuesByIndex = this.getValuesFromQueryFormControlByIndex(index);
    if ($event && $event.fieldTypeID === availableFields.skill) {
      const queryValues: any[] = $event.treeViewTagBoxOldValueIDs;
      const formQueryValues: any[] = formValuesByIndex.QueryValue;
      if (queryValues.length) {
        queryValues.forEach(value => {
          const oldQueryValuesExceptOtherValues: any[] = formQueryValues.filter(queryvalue => queryvalue.id === value);
          const otherQueryValuesExceptOldOne: any[] = formQueryValues.filter(queryvalue => queryvalue.id !== value);
          otherQueryValuesExceptOldOne.forEach(value => {
            this.formItems.controls.splice(index + 1, 0, this.formBuilder.group(
              this.createFormItems(
                formValuesByIndex.Operation,
                formValuesByIndex.Field,
                formValuesByIndex.Operator,
                [value]
              )
            ));
          });
          this.getQueryBuilderFormItemByIndexWithControlName(index, 'QueryValue').setValue(oldQueryValuesExceptOtherValues);
        });
      } else {
        const firstQueryValuesExceptOtherValues: any[] = formQueryValues.splice(0, 1);
        formQueryValues.forEach(value => {
          this.formItems.controls.splice(index + 1, 0, this.formBuilder.group(
            this.createFormItems(
              formValuesByIndex.Operation,
              formValuesByIndex.Field,
              formValuesByIndex.Operator,
              [value]
            )
          ));
        });
        this.getQueryBuilderFormItemByIndexWithControlName(index, 'QueryValue').setValue(firstQueryValuesExceptOtherValues);
      }
      setTimeout(() => {
        this.cdr.detectChanges();
        this.generateFilterExpression();
      }, 5000);
    }
  }

  generateFilterExpression() {
    const queryFormValues: BuilderFormItems[] = this.queryBuilderForm.getRawValue().items;
    this.filterExpression = '';
    queryFormValues.forEach((formItem, formItemIndex) => {
      const fieldTitle = this.fieldDataSource.find(field => field.FieldTypeID === formItem.Field.toString()).FieldTitle;
      const operation = this.operationDataSource.find(operation => operation.OperationID === +formItem.Operation).OperationName;
      const operator = this.availableOperatorDataSource.find(operator => operator.OperatorID === +formItem.Operator).OperatorName;
      const existedQueryGroupForCurrentFormIndex: string[] = this.getExistedGroupForCurrentFormIndex(formItemIndex);
      let parenthesisStartedForFormItem = '';
      let parenthesisEndedForFormItem = '';
      if (existedQueryGroupForCurrentFormIndex && existedQueryGroupForCurrentFormIndex.length) {
        existedQueryGroupForCurrentFormIndex.forEach(group => {
          if ((this.queryGroups[group]?.includes(formItemIndex)) && (this.queryGroups[group].indexOf(formItemIndex) === 0)) {
            parenthesisStartedForFormItem = `${parenthesisStartedForFormItem} <span class="parentheses">(</span> `;
          } else if ((this.queryGroups[group]?.includes(formItemIndex)) && (this.queryGroups[group]?.indexOf(formItemIndex) === (this.queryGroups[group]?.length - 1))) {
            parenthesisEndedForFormItem = `${parenthesisEndedForFormItem} <span class="parentheses">)</span> `;
          }
        });
      }
      if (formItemIndex === 0) {
        this.filterExpression = `${this.filterExpression}${parenthesisStartedForFormItem} <span class="field">${fieldTitle}</span> <span class="operator">${operator}</span> <span class="skill-value">"${(formItem.QueryValue[0] && formItem.QueryValue[0].text) || '" "'}"</span>${parenthesisEndedForFormItem}`;
      } else {
        this.filterExpression = `${this.filterExpression} <span class="operation">${operation}</span>${parenthesisStartedForFormItem} <span class="field">${fieldTitle}</span> <span class="operator">${operator}</span> <span class="skill-value">"${(formItem.QueryValue[0] && formItem.QueryValue[0].text) || '" "'}"</span>${parenthesisEndedForFormItem}`;
      }
    });
  }

}
