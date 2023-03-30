import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { userData } from 'src/models/user-data.model';
import { HomeService } from 'src/app/home/home.service';

@Injectable({
  providedIn: 'root'
})
export class UserStatsResolver implements Resolve<userData> {
  constructor(private homeService: HomeService) {}
  
  resolve(): Observable<userData> {
    return this.homeService.getStats();
  }
}