import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, tap, throwError } from 'rxjs';
import { AuthService } from 'src/Auth/auth.service';
import { userData } from '../../models/user-data.model';
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
      console.log('Successful response to get Date', response);
    }),
    catchError((error) => {
      console.log('we caught an error', error);
      console.log("looks like this user doesn't have any Date");
      return throwError(error);
    })
  );
}
  }
  
