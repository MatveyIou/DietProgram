import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, tap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { ICustomFood, userData } from '../../models/user-data.model';
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root'
})
export class OffcanvasService {
  private baseUrl = (environment.apiUrl)+'/login/home/product';
  constructor(private http: HttpClient,private authService: AuthService,) { }

  getSavedCustomFood():Observable<ICustomFood[][]>{
    return this.authService.getData("/home/products").pipe(
      tap((response) => {
        console.log("\x1b[32m"+'Successful response','getSavedCustomFood()', response);
      }),
      catchError((error) => {
        console.log('we caught an error getSavedCustomFood()', error);
        console.log("looks like this user doesn't have any CustomProducts");
        return throwError(error);
      })
    );
  }
  pushCustomProducts(newProduct:ICustomFood,indexType:number): Observable<any>{
    return this.authService.pushCustomProduct(newProduct,indexType).pipe(
      tap((response) => {
        console.log("\x1b[32m"+'Successful response','pushCustomProducts()', response);
      }),
      catchError(error => {
        console.log('Error registering product:', error.message);
        return throwError(() => error);
      })
    );
  }

  deleteCustomProduct(deleteProduct:ICustomFood): Observable<any>{
  return this.authService.deleteCustomProduct(deleteProduct).pipe(
    tap((response) => {
      console.log("\x1b[32m"+'Successful response','deleteCustomProduct()', response);
    }),
    catchError(error => {
      console.log('Error deleting product:', error.message);
      return throwError(() => error);
    })
  );
}
updateCustomFood(editProduct:ICustomFood):Observable<ICustomFood>{
  return this.authService.updateCustomFood(editProduct)
    .pipe(
      tap((response) => {
        console.log("\x1b[32m"+'Successful response','updateCustomFood()', response);
      }),
      catchError(error => {
        console.log('Error registering product:', error.message);
        return throwError(() => error);
      })
    );
}
}
  
