import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, lastValueFrom, tap, throwError } from 'rxjs';
import { AuthService } from 'src/Auth/auth.service';
import { ICustomFood, userData } from '../../models/user-data.model';
import { environment } from 'src/environment/environment';


@Injectable({
  providedIn: 'root'
})
export class OffcanvasService {
  private baseUrl = (environment.apiUrl)+'/login/home/product';
  constructor(private http: HttpClient,private authService: AuthService,) { }

  getSavedCustomFood():Observable<ICustomFood[][]>{
    console.log("Trying to get productS")
    return this.authService.getData("/home/products").pipe(
      tap((response) => {
        console.log('Successful response to get CustomProducts', response);
      }),
      catchError((error) => {
        console.log('we caught an error', error);
        console.log("looks like this user doesn't have any CustomProducts");
        return throwError(error);
      })
    );
  }
  pushCustomProducts(newProduct:ICustomFood,indexType:number): Observable<any>{
    console.log("Trying to push product")
    return this.authService.pushCustomProduct(newProduct,indexType)
    .pipe(
      catchError(error => {
        console.log('Error registering product:', error.message);
        return throwError(() => error);
      })
    );
  }

  deleteCustomProduct(deleteProduct:ICustomFood): Observable<any>{
    console.log("trying to delete")
  return this.authService.deleteCustomProduct(deleteProduct).pipe(
    catchError(error => {
      console.log('Error deleting product:', error.message);
      return throwError(() => error);
    })
  );
}
setEditCustomFood(editProduct:ICustomFood):Observable<ICustomFood>{
  console.log("trying to edit a single product")
  return this.authService.updateCustomFood(editProduct)
    .pipe(
      catchError(error => {
        console.log('Error registering product:', error.message);
        return throwError(() => error);
      })
    );
}
}
  
