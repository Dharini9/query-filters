import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import { DataSourceType } from '../constants';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QueryBuilderService {

  token;
  treeDataSource = [];
  treeViewskills = [];

  skillsDataReadyToBindSubject = new BehaviorSubject<boolean>(false);
  skillsDataReadyToBind = this.skillsDataReadyToBindSubject.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getToken() {
    return this.http.post(
      'http://localhost/api/Token',
      `username=admin@querybuilder.com&password=Bl@ckB3ar&grant_type=password`
    );
  }

  setToken(token) {
    this.token = token;
    this.getTreeViewDataSource();
  }

  setDataSourceToSelectionControl(dataSourceType, lookupID) {
    if (dataSourceType === DataSourceType.lookup) {
      return [];
    } else if (dataSourceType === DataSourceType.apiResponse) {
      const thisRef = this;
      const dataSource: any = {};
      dataSource.store = new CustomStore({
        load: function (loadOptions: any) {
          if (loadOptions.searchValue) {
            return thisRef.getAutoCompleteData(lookupID, loadOptions.searchValue, '')
              .toPromise()
              .then((data: any) => {
                const array: any[] = [];
                data.Data.forEach((dataSet: any) => {
                  array.push(dataSet);
                });
                return array;
              })
              .catch(error => {
                throw 'Data Loading Error';
              });
          }
        },
        byKey: (key) => {
          if (key > 0) {
            return thisRef.getAutoCompleteDataById(lookupID, key, '')
              .toPromise()
              .then((data: any) => {
                const array: any[] = [];
                array.push(data.Data);
                return array;
              })
              .catch(error => {
                throw 'Data Loading Error';
              });
          } else if (isNaN(key)) { // Return if value is as a text box
            const array: any[] = [];
            const data = { Value: key, Text: key };
            array.push(data);
            // return array;
            return new Promise((resolve, reject) => {
              resolve(array);
            });
          } else {
            return new Promise((resolve, reject) => {
              resolve(false);
            });
          }
        }
      });
      return dataSource;
    }
  }

  getAutoCompleteData(lookupID: string, prefix: string, extraData: any = '', takeRow: number = 10, skip: number = 0) {
    const formData: any = {};
    formData.lookupID = lookupID;
    formData.prefix = prefix;
    formData.extraData = extraData;
    formData.take = takeRow;
    formData.skip = skip;

    return this.http.post('http://localhost/api/Common/GetAutoComplete',
      formData,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      .pipe(map(
        data => {
          return data;
        }
      ));
  }

  getAutoCompleteDataById(lookupID: string, key: string, extraData: any = '') {
    const formData: any = {};
    formData.lookupID = lookupID;
    formData.value = '' + key; // Cast into string
    formData.extraData = extraData;

    return this.http.post('http://localhost/api/Common/GetAutoCompleteByValue',
      formData,
      {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      .pipe(map(
        data => {
          return data;
        }
      ));
  }

  getSkillsTreeViewDataSource() {
    return this.http.get('http://localhost/api/Candidate/GetSkills', {
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  getTreeViewDataSource() {
    this.getSkillsTreeViewDataSource()
      .subscribe(result => {
        if (result['Code'] === 200) {
          if (result['Data'].length) {
            const skills = result['Data'];
            // this.updateSkillsWithParentNode(skills);
            this.transformSkillStructureIntoPlainText(skills);
            this.treeViewskills = skills; // Object.values(skills);
            // if (this.skillsTreeView && this.skillsTreeView.instance) {
            //   this.skillsTreeView.instance.expandAll();
            // }
          }
        }
      });
  }

  transformSkillStructureIntoPlainText = (skills: any[]) => {
    skills.forEach((skill, index) => {
      this.treeDataSource.push({
        id: (index + 1).toString(),
        text: skill.text,
        skillId: skill.id,
        children: skill.items.length,
        expanded: true
      })

      if (skill.items.length) {
        skill.items.forEach((item, subIndex) => {
          this.treeDataSource.push({
            id: (index + 1) + '_' + (subIndex + 1),
            categoryId: (index + 1).toString(),
            text: item.text,
            skillId: item.id,
            children: item.items.length,
            expanded: item.expanded
          });

          if (item.items.length) {
            item.items.forEach((subitem, childIndex) => {
              this.treeDataSource.push({
                id: (index + 1) + '_' + (subIndex + 1) + '_' + (childIndex + 1),
                categoryId: (index + 1) + '_' + (subIndex + 1),
                text: subitem.text,
                skillId: subitem.id,
                rootCategory: skill.text,
                parentCategory: item.text,
                children: subitem.items.length,
                expanded: subitem.expanded
              });
            });
          }
        });
      }
    });

    this.skillsDataReadyToBindSubject.next(true);

  }
}
