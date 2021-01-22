import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from "@angular/material/table";
import { DbService } from "../services/db.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataForDialog } from "../interfaces/data-for-dialog";

@Component({
  selector: 'app-shift-dialog',
  templateUrl: './shift-dialog.component.html',
  styleUrls: ['./shift-dialog.component.scss']
})
export class ShiftDialogComponent implements OnInit {
@Output() dataToParentTable: EventEmitter<any> = new EventEmitter<any>();

  public displayedColumns: Array<string> = ['car', 'submerged', 'unloaded', 'delete'];
  public dataSourceOneCrane: MatTableDataSource<any> = new MatTableDataSource ([{car: '', submerged: '', unloaded: ''}]);
  public dataSourceDoubleCrane: MatTableDataSource<any> = new MatTableDataSource ([{car: '', submerged: '', unloaded: ''}]);
  public formCrane: FormGroup;
  public total: {[key: string]: number}= {
    submerged: 0,
    unload: 0
  };
  public dataToEdit;

  constructor(
      public fb: FormBuilder,
      public dialogRef: MatDialogRef<ShiftDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public elementId: number,
      private _dbService: DbService,
      private _matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.elementId) {
      this._dbService.getNoteByKey(this.elementId).subscribe(
          (response) => {
            this.dataToEdit = response;
            this.total = response.total;
            this.setDataToEdit(this.dataToEdit);
            this.setControlToCrane();
            this.dataToEdit.craneOne.forEach(() => {
              this.dataSourceOneCrane.data.push({car: '', submerged: '', unloaded: ''});
            });

            this.dataToEdit.craneTwo.forEach(() => {
              this.dataSourceDoubleCrane.data.push({car: '', submerged: '', unloaded: ''});
            });
            this.setCarArrayGroup();
          },
          (error) => {},
          () => {}
      );
    }
    if (!this.elementId) {
      this.formCrane = this.fb.group({
        typeCrane: new FormControl(null, Validators.required),
        fullName: new FormControl(null, Validators.required),
        date: new FormGroup({
          dateStart: new FormControl('', Validators.required),
          dateEnd: new FormControl('', Validators.required),
        }),
        craneOne: new FormArray([]),
        craneTwo: new FormArray([])
      });
      this.setCarArrayGroup();
      this.setControlToCrane();
    }



  }

  public setCarArrayGroup(): void {
    const carCtrlOne = this.formCrane.get('craneOne') as FormArray;
    const carCtrlTwo = this.formCrane.get('craneTwo') as FormArray;
    this.dataSourceOneCrane.data.forEach((item) => {
      carCtrlOne.push(new FormGroup({
        car: new FormControl(''),
        submerged: new FormControl({value: null, disabled: true}),
        unload: new FormControl({value: null, disabled: true})
      }));
    });
    this.dataSourceDoubleCrane.data.forEach((item) => {
      carCtrlTwo.push(new FormGroup({
        car: new FormControl(''),
        submerged: new FormControl({value: null, disabled: true}),
        unload: new FormControl({value: null, disabled: true})
      }));
    });
  }

  public saveForm(formCrane: FormGroup) {
    if (!this.formCrane.valid) {
      return;
    }
    let data: any = formCrane;
    data.craneOne = data.craneOne.filter((item) => item.car);
    data.craneTwo = data.craneTwo.filter((item) => item.car);
    data.total = this.total;
    if (this.elementId) {
      data.id = this.elementId;
      data.typeCrane = this.dataToEdit.typeCrane;
      this._dbService.updateNoteByKey(data).subscribe(
          (response) => {
            this.dataToParentTable.emit(data);
            this.dialogRef.close(data);
          }
      );
    } else {
      this._dbService.addNewNote(data).subscribe(
          (response) => {
            data.id = response;
            this.dataToParentTable.emit(data);
            this.dialogRef.close(data);
          }
      );
    }
  }



  public checkSubmerged(index, crane): void {
    let value = this.formCrane.get(crane).value[index].submerged;
    let control = this.formCrane.get(crane)['controls'][index].controls.unload;
    if (value) {
      control.disable();
    } else {
      control.enable();
    }
    this.getTotalData();
  }

  public checkUnload(index, crane): void {
    let value = this.formCrane.get(crane).value[index].unload;
    let control = this.formCrane.get(crane)['controls'][index].controls.submerged;
    if (value) {
      control.disable();
    } else {
      control.enable();
    }
    this.getTotalData();
  }

  public deleteNote(indexDelete: number, name): void {
    let formArray: FormArray;
    let dataSource;
    if (name === 'doubleCraneTable') {
      formArray = this.formCrane.get('craneTwo') as FormArray;
      dataSource = this.dataSourceDoubleCrane.data;
      dataSource = dataSource.filter((item, index) => index !== indexDelete);
      this.dataSourceDoubleCrane.data = dataSource;
      formArray.removeAt(indexDelete);

    }

    if (name === 'oneCraneTable') {
      formArray = this.formCrane.get('craneOne') as FormArray;
      dataSource = this.dataSourceOneCrane.data;
      dataSource = dataSource.filter((item, index) => index !== indexDelete);
      this.dataSourceOneCrane.data = dataSource;
      formArray.removeAt(indexDelete);
    }
    this.getTotalData();
  }

  public getTotalData() {
    this.total = {submerged: 0, unload: 0};
    let formValue = this.formCrane.value;
    let generalArray: Array<any> = formValue.craneOne.concat(formValue.craneTwo);
    generalArray.forEach((item) => {
      this.total.submerged += item.submerged ? item.submerged : 0;
      this.total.unload += item.unload ? item.unload : 0;
    });
  }

  public checkTypeCrane(): void {
    if (this.formCrane.get('typeCrane').value === 'one') {
      let formArray = this.formCrane.get('craneTwo') as FormArray;
      formArray.clear();
      this.getTotalData();
    }
  }

  public enableInfo(index, crane): void {
    let control = this.formCrane.get(crane)['controls'][index].controls;
    control.submerged.enable();
    control.unload.enable();
  }

  public setControlToCrane() {
    this.formCrane.get('craneOne').valueChanges.subscribe(
        (change) => {
          if (change[change.length - 1].car) {
            let currentDataTable = this.dataSourceOneCrane.data;
            currentDataTable.push({car: '', submerged: '', unloaded: ''});
            this.dataSourceOneCrane.data = currentDataTable;
            const carCtrl = this.formCrane.get('craneOne') as FormArray;
            carCtrl.push(
                new FormGroup({
                  car: new FormControl(''),
                  submerged: new FormControl({value: null, disabled: true}),
                  unload: new FormControl({value: null, disabled: true})
                })
            );
          }
        },
        (error) => {},
        () => {}
    );

    this.formCrane.get('craneTwo').valueChanges.subscribe(
        (change) => {
          if (change[change.length - 1].car) {
            let currentDataTable = this.dataSourceDoubleCrane.data;
            currentDataTable.push({car: '', submerged: '', unloaded: ''});
            this.dataSourceDoubleCrane.data = currentDataTable;
            const carCtrl = this.formCrane.get('craneTwo') as FormArray;
            carCtrl.push(
                new FormGroup({
                  car: new FormControl(''),
                  submerged: new FormControl({value: null, disabled: true}),
                  unload: new FormControl({value: null, disabled: true})
                })
            );
          }
        },
        (error) => {},
        () => {}
    );
  }

  private setDataToEdit(data: DataForDialog) {
    this.formCrane = this.fb.group({
      typeCrane: new FormControl({value: data.typeCrane, disabled: true}, Validators.required),
      fullName: new FormControl(data.fullName, Validators.required),
      date: new FormGroup({
        dateStart: new FormControl(data.date.dateStart, Validators.required),
        dateEnd: new FormControl(data.date.dateEnd, Validators.required),
      }),
      craneOne: new FormArray([]),
      craneTwo: new FormArray([])
    });
    const carCtrlOne = this.formCrane.get('craneOne') as FormArray;
    const carCtrlTwo = this.formCrane.get('craneTwo') as FormArray;
    data.craneOne.forEach((item) => {
      carCtrlOne.push(new FormGroup({
        car: new FormControl(item.car),
        submerged: item.submerged ? new FormControl(item.submerged) : new FormControl({value: null, disabled: true}),
        unload: item.unload ? new FormControl(item.unload) : new FormControl({value: null, disabled: true}),
      }))
    })
    data.craneTwo.forEach((item) => {
      carCtrlTwo.push(new FormGroup({
        car: new FormControl(item.car),
        submerged: item.submerged ? new FormControl(item.submerged) : new FormControl({value: null, disabled: true}),
        unload: item.unload ? new FormControl(item.unload) : new FormControl({value: null, disabled: true})
      }))
    })
  }
}
