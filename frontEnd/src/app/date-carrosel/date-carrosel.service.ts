import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, tap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { IUserPreset, userData } from '../../models/user-data.model';
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root'
})
export class DateCarroselService {
  private baseUrl = (environment.apiUrl)+'/login/home';
  constructor(private http: HttpClient,private authService: AuthService,) { }

  getDateName(): Observable<string[]> {
  return this.authService.getData('/home/date').pipe(
    tap((response) => {
      console.log("\x1b[32m"+'Successful response to GET Date', response);
    }),
    catchError((error) => {
      console.log('we caught an error', error);
      console.log("looks like this user doesn't have any Date");
      return throwError(error);
    })
  );
}

getNextNewData(): Observable<IUserPreset>  {
  return this.authService.updateNextNewData().pipe(
    tap((response) => {
      console.log('Successful response to GET new Date', response);
    }),
    catchError((error) => {
      console.log('we caught an error', error);
      console.log("looks like this we cant push to the user");
      return throwError(error);
    })
  );
}
  }
  
