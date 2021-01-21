import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from "ngx-indexed-db";

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(
      private dbService: NgxIndexedDBService
  ){}

  public addNewNote(data) {
    return this.dbService.add('crane', data);
  }

  public getAllNotes() {
    return this.dbService.getAll('crane');
  }

  public getNoteByKey(key) {
    return this.dbService.getByKey('crane', key);
  }

  public deleteNoteByKey(key) {
    return this.dbService.delete('crane', key);
  }

  public updateNoteByKey(data) {
    return this.dbService.update('crane', data);
  }
}
