import { FormControl } from "@angular/forms";

export class OperatorDataSource {
    OperatorID: number;
    OperatorName: string;
    FieldTypeIDs: string[];
}

export class OperationDataSource {
    OperationID: number;
    OperationName: string;
}

export enum ControlSelectionType {
    'single' = 'singleSelection',
    'multiple' = 'multiSelection'
}

export enum DataSourceType {
    'lookup' = 'lookup',
    'apiResponse' = 'apiResponse'
}

export class Lookup {
    LookupID: string;
    LookupDataSource: LookupDataSource[];
}

export class LookupDataSource {
    Value: number | string;
    Text: string;
}

export class FieldDataSource {
    FieldTypeID: string;
    FieldTitle: string;
    ControlType: string;
    ControlSelectioType?: ControlSelectionType.single | ControlSelectionType.multiple;
    Placeholder: string;
    GroupIDs: string[];
    SearchEnabled?: boolean;
    LookupID?: string;
    DataSourceType?: DataSourceType.apiResponse | DataSourceType.lookup;
    DateControlType?: DxDateBoxControlDateType.date | DxDateBoxControlDateType.dateTime;
    DisplayExpr?: string;
    ValueExpr?: string;
}

export enum availableFields {
    skill = 'skill',
    firstname = 'firstname',
    company = 'company',
    employmentType = 'employmentType',
    jobOrderName = 'jobOrderName',
    startDate = 'startDate',
    endDate = 'endDate',
    recruiters = 'recruiters'
}

export enum availableFieldsControlTypes {
    AutoComplete = 'AutoComplete',
    TreeView = 'TreeView',
    TagBox = 'TagBox',
    TextBox = 'TextBox',
    SelectBox = 'SelectBox',
    DateBox = 'DateBox'
}

export const defaultQueryValueForNoFields: FieldDataSource = {
    FieldTitle: '',
    FieldTypeID: '',
    ControlType: 'TextBox',
    Placeholder: '',
    GroupIDs: []
};

export enum DxDateBoxControlDateType {
    dateTime = 'datetime',
    date = 'date'
};

export enum NO_OF_LINES {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
    SIX = 6
};

export const BuilderFieldDataSource: FieldDataSource[] = [
    {
        FieldTypeID: 'skill',
        FieldTitle: 'Skills',
        ControlType: 'TreeView',
        ControlSelectioType: ControlSelectionType.multiple,
        Placeholder: '',
        GroupIDs: []
    }
    // , {
    //     FieldTypeID: 'firstname',
    //     FieldTitle: 'First Name',
    //     ControlType: 'TextBox',
    //     Placeholder: 'Enter First Name Here',
    //     GroupIDs: []
    // }, {
    //     FieldTypeID: 'company',
    //     FieldTitle: 'Company Name',
    //     ControlType: 'TreeView',
    //     ControlSelectioType: ControlSelectionType.single,
    //     Placeholder: 'Search Company',
    //     GroupIDs: [],
    //     SearchEnabled: true
    // }, {
    //     FieldTypeID: 'employmentType',
    //     FieldTitle: 'Employment Type',
    //     ControlType: 'TagBox',
    //     ControlSelectioType: ControlSelectionType.multiple,
    //     Placeholder: '',
    //     GroupIDs: [],
    //     SearchEnabled: true
    // }, {
    //     FieldTypeID: 'jobOrderName',
    //     FieldTitle: 'Job Order',
    //     ControlType: 'SelectBox',
    //     ControlSelectioType: ControlSelectionType.single,
    //     Placeholder: '',
    //     GroupIDs: [],
    //     LookupID: 'SearchRecruiters',
    //     DataSourceType: DataSourceType.apiResponse,
    //     DisplayExpr: 'Text',
    //     ValueExpr: 'Value'
    // }, {
    //     FieldTypeID: 'startDate',
    //     FieldTitle: 'Start Date',
    //     ControlType: 'DateBox',
    //     Placeholder: 'dd/mm/yyyy',
    //     GroupIDs: []
    // }, {
    //     FieldTypeID: 'endDate',
    //     FieldTitle: 'End Date',
    //     ControlType: 'DateBox',
    //     DateControlType: DxDateBoxControlDateType.dateTime,
    //     Placeholder: 'dd/mm/yyyy hh:mm:ss',
    //     GroupIDs: []
    // }, {
    //     FieldTypeID: 'recruiters',
    //     FieldTitle: 'Recruiters',
    //     ControlType: 'AutoComplete',
    //     ControlSelectioType: ControlSelectionType.single,
    //     Placeholder: 'Search Recruiters',
    //     GroupIDs: [],
    //     DataSourceType: DataSourceType.apiResponse,
    //     LookupID: 'SearchRecruiters',
    //     DisplayExpr: 'Text',
    //     ValueExpr: 'Value'
    // },
];

export const BuilderOperationDataSource: OperationDataSource[] = [
    {
        OperationID: 1,
        OperationName: 'AND'
    }, {
        OperationID: 2,
        OperationName: 'OR'
    }
];

export const BuilderOperatorDataSource: OperatorDataSource[] = [
    {
        OperatorID: 1,
        OperatorName: '=',
        FieldTypeIDs: ['skill', 'firstname', 'company', 'employmentType', 'jobOrderName', 'startDate', 'endDate', 'recruiters']
    }, {
        OperatorID: 2,
        OperatorName: '!=',
        FieldTypeIDs: ['skill', 'firstname', 'company', 'employmentType', 'jobOrderName', 'startDate', 'endDate', 'recruiters']
    }, {
        OperatorID: 3,
        OperatorName: '<',
        FieldTypeIDs: ['startDate', 'endDate']
    }, {
        OperatorID: 4,
        OperatorName: '>',
        FieldTypeIDs: ['startDate', 'endDate']
    }, {
        OperatorID: 5,
        OperatorName: '<=',
        FieldTypeIDs: ['startDate', 'endDate']
    }, {
        OperatorID: 6,
        OperatorName: '=>',
        FieldTypeIDs: ['startDate', 'endDate']
    }, {
        OperatorID: 7,
        OperatorName: 'Between',
        FieldTypeIDs: ['startDate', 'endDate']
    }, {
        OperatorID: 9,
        OperatorName: 'Contains',
        FieldTypeIDs: ['firstname', 'company', 'employmentType', 'jobOrderName', 'recruiters']
    }, {
        OperatorID: 10,
        OperatorName: 'Starts with',
        FieldTypeIDs: ['firstname', 'company', 'employmentType', 'jobOrderName', 'recruiters']
    }, {
        OperatorID: 11,
        OperatorName: 'Ends with',
        FieldTypeIDs: ['firstname', 'company', 'employmentType', 'jobOrderName', 'recruiters']
    }, {
        OperatorID: 12,
        OperatorName: 'Does not contain',
        FieldTypeIDs: ['firstname', 'company', 'employmentType', 'jobOrderName', 'recruiters']
    }, {
        OperatorID: 8,
        OperatorName: 'Reset',
        FieldTypeIDs: ['firstname', 'company', 'employmentType', 'jobOrderName', 'startDate', 'endDate', 'recruiters']
    }
];

export class BuilderFormItems {
    IsCheckedForGrouping: FormControl;
    Operation: FormControl;
    Field: FormControl;
    Operator: FormControl;
    QueryValue: FormControl;
}
