import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { IUser } from "../../../models/user.model"
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RegFinalService {
  private baseUrl = (environment.apiUrl)+'/login/reg-final';
  constructor(private http: HttpClient) { }

  registerUser(user: IUser): Observable<IUser> {
    // console.log(this.baseUrl)
    return this.http.post<IUser>(this.baseUrl, user)
    .pipe(
      catchError(error => {
        console.log('Error registering user:', error.message);
        return throwError(() => error);
      })
    );;
  }
}