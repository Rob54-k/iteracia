import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ListShiftComponent } from './list-shift/list-shift.component';
import { MatTableModule } from "@angular/material/table";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { ShiftDialogComponent } from './shift-dialog/shift-dialog.component';
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { ReactiveFormsModule } from "@angular/forms";
import { DBConfig, NgxIndexedDBModule } from "ngx-indexed-db";

const dbConfig: DBConfig  = {
    name: 'MyDb',
    version: 1,
    objectStoresMeta: [{
        store: 'crane',
        storeConfig: { keyPath: 'id', autoIncrement: true },
        storeSchema: []
    }]
};

@NgModule({
  declarations: [
    AppComponent,
    ListShiftComponent,
    ShiftDialogComponent,
  ],
    imports: [
        BrowserModule,
        NoopAnimationsModule,
        MatTableModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        NgxIndexedDBModule.forRoot(dbConfig)
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
