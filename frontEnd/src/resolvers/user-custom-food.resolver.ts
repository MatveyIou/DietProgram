import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { OffcanvasService } from 'src/app/offcanvas/offcanvas.service';
import { ICustomFood } from 'src/models/user-data.model';

@Injectable({
  providedIn: 'root'
})
export class UserCustomFoodResolver implements Resolve<ICustomFood[][]> {
  constructor(private offcanvasService: OffcanvasService) {}

  resolve(): Observable<ICustomFood[][]> {
    return this.offcanvasService.getSavedCustomFood();
  }
}