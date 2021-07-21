import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DxDropDownBoxComponent, DxTagBoxComponent, DxTooltipComponent, DxTreeViewComponent } from 'devextreme-angular';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { availableFields, availableFieldsControlTypes, BuilderFieldDataSource, defaultQueryValueForNoFields, DxDateBoxControlDateType, FieldDataSource, NO_OF_LINES } from '../constants';
import { QueryBuilderService } from '../services/query-builder.service';

@Component({
  selector: 'app-filter-builder-form-control',
  templateUrl: './filter-builder-form-control.component.html',
  styleUrls: ['./filter-builder-form-control.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => FilterBuilderFormControlComponent)
    }
  ]
})
export class FilterBuilderFormControlComponent implements OnInit, ControlValueAccessor, OnChanges {

  @Input() fieldTypeID: string;
  @Input() disabled: boolean;
  @Input() formControlIndex: number;
  @Output() onQueryValueChanged: EventEmitter<any> = new EventEmitter();

  @ViewChild('skillsTreeView') skillsTreeView: DxTreeViewComponent;
  @ViewChild('skillCatagoryTooltip') skillCatagoryTooltip: DxTooltipComponent;

  fieldDataSource: FieldDataSource[] = BuilderFieldDataSource;
  currentQueryControl: FieldDataSource = defaultQueryValueForNoFields;
  availableFields = availableFields;
  availableFieldsControlTypes = availableFieldsControlTypes;
  dataSourceForSelectionType;
  token;

  treeViewTagBoxValues = [];
  treeViewTagBoxValueIDs = [];
  treeViewTagBoxOldValueIDs = [];
  treeDataSource = [];
  treeViewskills: any[] = [];
  isDefaultValueProvidedToFormControl = false;
  catagoryInfoTooltip;

  // controlValue: any;
  onChange = (controlValue) => { };
  onTouched = () => { };
  touched = false;
  controlValue;

  constructor(
    private queryBuilderService: QueryBuilderService,
    private cdr: ChangeDetectorRef
  ) {
    this.queryBuilderService.skillsDataReadyToBind.subscribe(isSkillsDataReady => {
      if (isSkillsDataReady) {
        this.treeDataSource = JSON.parse(JSON.stringify(this.queryBuilderService.treeDataSource));
      }
    });
  }

  ngOnInit(): void { }

  ngOnChanges(): void {
    console.log(this.fieldTypeID);
    if (this.fieldTypeID && this.fieldDataSource && this.fieldDataSource.length) {
      this.currentQueryControl = this.fieldDataSource.find(field => field.FieldTypeID === this.fieldTypeID);
      if (this.currentQueryControl.DataSourceType) {
        this.dataSourceForSelectionType = this.queryBuilderService.setDataSourceToSelectionControl(this.currentQueryControl.DataSourceType, this.currentQueryControl.LookupID);
      }
    }
  }

  onValueChanged($event, fieldTypeID) {
    this.markAsTouched();
    if ($event && !this.disabled) {
      const outputValues = {
        fieldTypeID: fieldTypeID
      };
      if (fieldTypeID === availableFields.skill) {
        this.controlValue = this.treeViewTagBoxValues;
        outputValues['treeViewTagBoxOldValueIDs'] = this.treeViewTagBoxOldValueIDs;
      } else {
        this.controlValue = $event.value;
      }
      this.onChange(this.controlValue);
      if (!this.isDefaultValueProvidedToFormControl) {
        this.onQueryValueChanged.emit(outputValues);
      }
    }
  }

  writeValue(value: number | string | any[]) {
    this.controlValue = value;
    if (this.fieldTypeID === availableFields.skill && this.controlValue && this.controlValue.length) {
      console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$', [...this.controlValue]);
      this.isDefaultValueProvidedToFormControl = true;
      this.treeViewTagBoxValues = [...this.controlValue];
      this.treeViewTagBoxValueIDs = this.controlValue.map(treeViewValue => treeViewValue.id);
    }
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

  // getToken() {
  //   this.queryBuilderService.getToken().subscribe((result) => {
  //     this.token = result["access_token"];
  //     this.queryBuilderService.setToken(this.token);
  //     this.getTreeViewDataSource();
  //   });
  // }

  // getTreeViewDataSource() {
  //   this.queryBuilderService.getTreeViewDataSource()
  //     .subscribe(result => {
  //       if (result['Code'] === 200) {
  //         if (result['Data'].length) {
  //           const skills = result['Data'];
  //           // this.updateSkillsWithParentNode(skills);
  //           this.transformSkillStructureIntoPlainText(skills);
  //           this.treeViewskills = skills; // Object.values(skills);
  //           if (this.skillsTreeView && this.skillsTreeView.instance) {
  //             this.skillsTreeView.instance.expandAll();
  //           }
  //         }
  //       }
  //     });
  // }

  clearTagBoxValues() {
    this.treeViewTagBoxValueIDs = [];
    this.treeViewTagBoxValues = [];
  }

  checkIfPreviousValueAndValueAreSame(previousValue: any[], value: any[]) {
    return (previousValue.length === value.length) && previousValue.every((valueElement) => value.includes(valueElement));
  }

  // transformSkillStructureIntoPlainText = (skills: any[]) => {
  //   skills.forEach((skill, index) => {
  //     this.treeDataSource.push({
  //       id: (index + 1).toString(),
  //       text: skill.text,
  //       skillId: skill.id,
  //       children: skill.items.length,
  //       expanded: true
  //     })

  //     if (skill.items.length) {
  //       skill.items.forEach((item, subIndex) => {
  //         this.treeDataSource.push({
  //           id: (index + 1) + '_' + (subIndex + 1),
  //           categoryId: (index + 1).toString(),
  //           text: item.text,
  //           skillId: item.id,
  //           children: item.items.length,
  //           expanded: item.expanded
  //         });

  //         if (item.items.length) {
  //           item.items.forEach((subitem, childIndex) => {
  //             this.treeDataSource.push({
  //               id: (index + 1) + '_' + (subIndex + 1) + '_' + (childIndex + 1),
  //               categoryId: (index + 1) + '_' + (subIndex + 1),
  //               text: subitem.text,
  //               skillId: subitem.id,
  //               rootCategory: skill.text,
  //               parentCategory: item.text,
  //               children: subitem.items.length,
  //               expanded: subitem.expanded
  //             });
  //           });
  //         }
  //       });
  //     }

  //   })
  // }

  treeView_itemSelectionChanged($event) {
    this.treeViewTagBoxOldValueIDs = this.treeViewTagBoxValueIDs;
    const selectedValues: any[] = $event.component.getSelectedNodeKeys();
    this.removeSelectParentCategoryValue(selectedValues);
    this.treeViewTagBoxValues = [];
    selectedValues.forEach((value) => {
      if (this.treeViewTagBoxValues.findIndex(tagValue => tagValue.id === value) === -1) {
        this.treeViewTagBoxValues.push(this.treeDataSource.find(treeItem => treeItem.id === value));
      }
    });
    this.treeViewTagBoxValueIDs = selectedValues;
    if ($event && $event.itemElement) {
      this.isDefaultValueProvidedToFormControl = false;
    }
  }

  removeSelectParentCategoryValue(values: any[]) {
    values.forEach((value, index) => {
      this.treeDataSource.forEach(item => {
        if (item.id === value) {
          if (item.children > 0) {
            values.splice(index, 1);
            this.removeSelectParentCategoryValue(values);
            this.cdr.detectChanges();
          }
        }
      });
    });
  }

  onTreeViewItemRendered(e: any) {
    // Handling Parent skill node checboxes hiding By finding subling checkbox node
    if (e.itemData.items && e.itemData.items.length) {
      if (e.itemElement.previousSibling) {
        const className = e.itemElement.previousSibling.className;
        if (className.indexOf('dx-checkbox') > -1 && className.indexOf('dx-widget') > -1) {
          e.itemElement.previousSibling.style.display = 'none';
        }
      }
      // Overriding left padding....
      if (e.itemElement.className.indexOf('dx-treeview-item') > -1 && e.itemElement.className.indexOf('dx-item') > -1) {
        e.itemElement.style.paddingLeft = '5px';
      }
    }
  }

  syncTreeViewSelection() {
    const anyKeywordComp = this.skillsTreeView && this.skillsTreeView.instance;
    if (!anyKeywordComp) {
      return;
    }

    if (anyKeywordComp) {
      if (this.treeViewTagBoxValueIDs.length) {
        this.treeViewTagBoxValueIDs.forEach((value) => {
          anyKeywordComp.selectItem(value);
          anyKeywordComp.expandItem(value);
          this.cdr.detectChanges();
        });
      } else {
        anyKeywordComp.unselectAll()
      }
    }
  }

  onTagBoxOpened($event) {
    this.fetchTreeViewInstance()
      .then(() => {
        this.syncTreeViewSelection();
      });
  }

  /** Fn retuning a promis for treeview instance is ready or not */
  fetchTreeViewInstance() {
    return new Promise((resolve, reject) => {
      const treeViewInstanceInterval = setInterval(() => {
        if (this.skillsTreeView && this.skillsTreeView.instance) {
          clearInterval(treeViewInstanceInterval);
          resolve(true);
        }
      }, 5);
    });
  }

  onTagBoxSelectionChanged($event) {
    const anyKeywordComp = this.skillsTreeView && this.skillsTreeView.instance;
    if (!anyKeywordComp) {
      return;
    }
    if (anyKeywordComp) {
      if ($event) {
        if ($event.addedItems && $event.addedItems.length) {
          const addedItems: any[] = $event.addedItems;
          addedItems.forEach(item => {
            anyKeywordComp.selectItem(item);
          });
        }
        if ($event.removedItems && $event.removedItems.length) {
          const removedItems: any[] = $event.removedItems;
          removedItems.forEach(item => {
            anyKeywordComp.unselectItem(item);
          });
        }
      }
    }
  }

  removeSkillTag(tag) {
    if (this.treeViewTagBoxValueIDs && this.treeViewTagBoxValueIDs.length) {
      this.treeViewTagBoxValueIDs = this.treeViewTagBoxValueIDs.filter(tagValue => tagValue !== tag.id);
      this.treeViewTagBoxValues = this.treeViewTagBoxValues.filter(tagValue => tagValue.id !== tag.id);
    }
    if (this.isDefaultValueProvidedToFormControl) {
      this.isDefaultValueProvidedToFormControl = false;
    }
  }

  showToolTip(tag, tagId) {
    if (this.skillCatagoryTooltip && this.skillCatagoryTooltip.instance) {
      this.catagoryInfoTooltip = tag;
      if (this.catagoryInfoTooltip) {
        this.skillCatagoryTooltip.instance.show('#' + tagId);
      }
    }
  }

  hideToolTip() {
    if (this.skillCatagoryTooltip && this.skillCatagoryTooltip.instance) {
      this.skillCatagoryTooltip.instance.hide();
    }
  }

}
