import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, tap, throwError } from 'rxjs';
import { AuthService } from 'src/Auth/auth.service';
import { userData } from '../../models/user-data.model';

import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root'
})
export class HomeService {
  // private baseUrl = (environment.apiUrl)+'/login/home';
  constructor(private http: HttpClient,private authService: AuthService,) { }
  getStats(): Observable<userData> {
  return this.authService.getData('/home').pipe(
    tap((response) => {
      console.log('Successful response to get userStats FROM HOME>SERVICE', response);
    }),
    catchError((error) => {
      console.log('we caught an error', error);
      console.log("looks like this user doesn't have any stats");
      return throwError(error);
    })
  );
}
  }
  
