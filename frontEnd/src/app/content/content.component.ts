import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ICustomFood, userData } from 'src/models/user-data.model';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent {
  indexView = 0
  updateIndex(event:number){
    console.log("we have index number", event)
    this.indexView=event
  }
}
