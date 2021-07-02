import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxAutocompleteModule, DxButtonModule, DxCheckBoxModule, DxDateBoxModule, DxSelectBoxComponent, DxSelectBoxModule, DxTagBoxModule, DxTextBoxModule, DxTreeViewModule } from 'devextreme-angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QueryBuilderComponent } from './query-builder/query-builder.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterBuilderFormControlComponent } from './filter-builder-form-control/filter-builder-form-control.component';

@NgModule({
  declarations: [
    AppComponent,
    QueryBuilderComponent,
    FilterBuilderFormControlComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxSelectBoxModule,
    DxTagBoxModule,
    DxTreeViewModule,
    DxTextBoxModule,
    DxAutocompleteModule,
    DxDateBoxModule,
    DxCheckBoxModule,
    FormsModule,
    ReactiveFormsModule,
    DxButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
