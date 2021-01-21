import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { ShiftDialogComponent } from "../shift-dialog/shift-dialog.component";
import { MatTableDataSource } from "@angular/material/table";
import { DbService } from "../services/db.service";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-list-shift',
  templateUrl: './list-shift.component.html',
  styleUrls: ['./list-shift.component.scss']
})
export class ListShiftComponent implements OnInit, OnDestroy {
  public dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public displayedColumns: Array<string> = ['fullName', 'dateStart', 'dateEnd', 'typeCrane', 'submerged', 'unloaded', 'edit', 'delete'];

  private _subscription: Subscription[] = [];

  constructor(
      private _dialog: MatDialog,
      private _dbService: DbService
  ) { }

  ngOnInit(): void {
    this._subscription.push(this._dbService.getAllNotes().subscribe(
        (response) => {
          let dataSource = [];
          response.forEach((item) => {
            dataSource.push(this.prepareDate(item));
          });
          this.dataSource.data = dataSource;
        },
        (error) => {},
        () => {}
    ));
  }

  ngOnDestroy() {
    this._subscription.forEach((item) => item.unsubscribe());
  }

  public deleteShift(element: any) {
    let dataSource = this.dataSource.data;
    dataSource = dataSource.filter((item) => item.id !== element.id);
    this._subscription.push(this._dbService.deleteNoteByKey(element.id).subscribe(
      (response) => {},
      (error) => {},
      () => {}
    ));
    this.dataSource.data = dataSource;
  }

  public editShift(elementId) {
    let dialogRef = this._dialog.open(ShiftDialogComponent, {
      maxHeight: '95vh',
      data: elementId
    });
    dialogRef.componentInstance.dataToParentTable.subscribe(
        (data) => {
          let indexEdited = this.dataSource.data.findIndex((item) => item.id === data.id);
          if (indexEdited !== -1) {
            let dataSource = this.dataSource.data;
            dataSource[indexEdited] = this.prepareDate(data);
            this.dataSource.data = dataSource;
          }
        },
        (error) => {},
        () => {}
    );
  }

  public addShift() {

    let dialogRef = this._dialog.open(ShiftDialogComponent, {
      maxHeight: '95vh',
    });
    dialogRef.componentInstance.dataToParentTable.subscribe(
    (data) => {
      let dataSourceCtrl = this.dataSource.data;
      dataSourceCtrl.push(this.prepareDate(data));
      this.dataSource.data = dataSourceCtrl;
    },
    (error) => {},
    () => {}
    );
  }

  public prepareDate(data) {
    return  {
      fullName: data.fullName,
      dateStart: data.date.dateStart,
      dateEnd: data.date.dateEnd,
      submerged: data.total.submerged,
      unloaded: data.total.unload,
      typeCrane: data.typeCrane,
      delete: '',
      edit: '',
      id: data.id
    }
  }
}
