import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, tap, throwError } from 'rxjs';
import { AuthService } from 'src/Auth/auth.service';
import { ICustomFood, userData } from '../../models/user-data.model';
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root'
})
export class SelectorService {
  //private baseUrl = (environment.apiUrl)+'/login/home/product';
  constructor(private http: HttpClient,private authService: AuthService,) { }

  getSelectedFood(date:string):Observable<ICustomFood[][]>{
    console.log("Trying to get Selected Product",date)
    return this.authService.getSelectedFoodData("/home/selectedproducts",date).pipe(
      tap((response) => {
        console.log('Successful response to get SelectedProducts', response);
      }),
      catchError((error) => {
        console.log('we caught an error', error);
        console.log("looks like this user doesn't have any SelectedProducts");
        return throwError(error);
      })
    );
  }
  updateSelectedFood(date:string,selectedFood: ICustomFood[][]):Observable<ICustomFood[][]>{
    console.log("Trying to get Selected Product",date)
    return this.authService.updateSelectedFoodData("/home/selectedproducts/put",date,selectedFood).pipe(
      tap((response) => {
        console.log('Successful response to get SelectedProducts', response);
      }),
      catchError((error) => {
        console.log('we caught an error', error);
        console.log("looks like this user doesn't have any SelectedProducts");
        return throwError(error);
      })
    );
  }
  }
  
