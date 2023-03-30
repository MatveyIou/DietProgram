import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';

import { DateCarroselService } from 'src/app/date-carrosel/date-carrosel.service';
import { ICustomFood } from 'src/models/user-data.model';

@Injectable({
  providedIn: 'root'
})
export class UserDateResolver implements Resolve<string[]> {
  constructor(private dateCarroselService: DateCarroselService) {}

  resolve(): Observable<string[]> {
    return this.dateCarroselService.getDateName();
  }
}