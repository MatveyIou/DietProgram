import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, map, tap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { ICustomFood, userData } from '../../models/user-data.model';
import { environment } from 'src/environment/environment';
import { IUser } from 'src/models/user.model';


@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  private baseUrl = (environment.apiUrl)+'/login/home';
  constructor(private http: HttpClient,private authService: AuthService,) { }

  getUserName(): Observable<string> {
  return this.authService.getData('/home/header').pipe(
    map(response => response.username),
    tap((response) => {
      console.log("\x1b[32m"+'Successful response','getUserName()', response);
    }),
    catchError((error) => {
      console.log('we caught an error getUserName()', error);
      console.log("looks like this we cant get the user name");
      return throwError(error);
    })
  );
}

  }
  
