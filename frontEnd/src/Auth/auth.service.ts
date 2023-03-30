import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environment/environment';
import { Router } from '@angular/router';
import { UserStatsResolver } from 'src/resolvers/user-stats.resolver';
import { ICustomFood } from 'src/models/user-data.model';

interface LoginResponse {
  _id:string;
  access_token: string;
}

export interface TokenValidationResponse {
  isValid: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';
  private baseUrl = environment.apiUrl + '/login';
  private validationUrl = environment.apiUrl + '/login/validate';

  private isAuthenticated$ = new BehaviorSubject<boolean>(this.hasToken());
  private isValid$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(private http: HttpClient,
    private router: Router
  ) { }
  /**
   * We will use the Observable to check in a async way.
   * That means when we .subscribe() to it we can view any changes an act accordantly to does changes
   * idk how its works
   */
  login(email: string, password: string): Observable<LoginResponse> {
    console.log("trying to login")
    return this.http.post<LoginResponse>(this.baseUrl, { email, password })
      .pipe(
        tap(response => {
          // apparently response.access_token doesn't work 
          //console.log("respond from server; JWT token: ", response['access_token'])
          this.setToken(response['access_token']);
          this.isAuthenticated$.next(true);
          this.isValid$.next(true)
          this.setSessionKeyUserStatsID(response._id)
        })
      );
  }

  logout(): void {
    this.removeToken();
    this.isAuthenticated$.next(false);
    this.removeSessionKeyUserStatsID()
    this.redirect()
    console.log("logged out")
  }

  getData(route: string): Observable<any> {// TODO BACK END PRODUCTS
    //console.log("trying to get: ", this.baseUrl +route)
    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.getToken(),
      User_ID:this.getSessionKeyUserStatsID()!
    });
    return this.http.get(this.baseUrl + route, {headers});
  }
  getSelectedFoodData(route: string,date:string): Observable<any> {// TODO BACK END PRODUCTS
    //console.log("trying to get: ", this.baseUrl +route)
    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.getToken(),
      User_ID:this.getSessionKeyUserStatsID()!,
      customdate:date!
    });
  
    return this.http.get(this.baseUrl + route, {headers});
  }
  updateSelectedFoodData(route: string,date:string,selectedFood:ICustomFood[][]): Observable<any> {// TODO BACK END PRODUCTS
    //console.log("trying to get: ", this.baseUrl +route)
    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.getToken(),
      User_ID:this.getSessionKeyUserStatsID()!,
      customdate:date!
    });
    return this.http.put(this.baseUrl + route,selectedFood, {headers});
  }
pushCustomProduct(newProduct:ICustomFood,indexType:number): Observable<any>{
    console.log("trying to update")
    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.getToken(),
      User_ID:this.getSessionKeyUserStatsID()!
    });
    return this.http.put<ICustomFood>(this.baseUrl+"/home/product/put?index="+indexType,newProduct,{headers})
  }
deleteCustomProduct(deleteProduct:ICustomFood): Observable<any>{
  console.log("trying to delete")
  const headers = new HttpHeaders({
    Authorization: "Bearer " + this.getToken(),
    User_ID:this.getSessionKeyUserStatsID()!
  });
  return this.http.delete<ICustomFood>(this.baseUrl+"/home/product/delete/"+deleteProduct._id,{headers})
}
updateCustomFood(editProduct:ICustomFood): Observable<any>{
  console.log("trying to edit a product")
  const headers = new HttpHeaders({
    Authorization: "Bearer " + this.getToken(),
    User_ID:this.getSessionKeyUserStatsID()!
  });
  return this.http.put<ICustomFood>(this.baseUrl+"/home/product/put/edit", editProduct,{headers})
}

  // postCustomProducts(route: string, data:userProducts): Observable<any>{
  //   const headers = new HttpHeaders({
  //     Authorization: "Bearer " + this.getToken()
  //   });
  //   console.log("postCustomProducts ", route, data, headers)
  //   console.log(this.http.post(this.baseUrl + route, data, { headers })) 
  //   return this.http.post<userProducts>(this.baseUrl + route, data, { headers });
  // }
  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }
  
  async getIsValid(): Promise<Observable<boolean>> {
    await this.checkTokenValidity();
    return this.isValid$.asObservable();
  }
  
  private async checkTokenValidity(): Promise<void> {
    console.log("checking for Validity")
    try {
      const response = await firstValueFrom(this.validateToken());
      if (response!.isValid) {
        console.log('Token is Valid!');
      } else {
        console.log('Token is InValid! logging out');
        this.isValid$.next(false);
        this.logout()
      }
    } catch (error) {
      console.log("Error validating token, need to logging out", error);
      this.isValid$.next(false);
    }
  }
  private validateToken(): Observable<TokenValidationResponse> {
    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.getToken()
    });
    return this.http.get<TokenValidationResponse>(this.validationUrl, { headers }).pipe(
      tap({
        next: (response: TokenValidationResponse) => {
          console.log('Token validation response:', response);
        },
        error: (error: any) => {
          console.log('Token validation failed:', error);
        }
      })
    );
  }
  private redirect(): void {
    console.log("redirecting to /login")
    this.router.navigate(['/login']);
  }
  getSessionKeyUserStatsID(){
    console.log("getting SessionKeyUserStatsID ")
    return sessionStorage.getItem('userID')
  }
  setSessionKeyUserStatsID(userID:string){
    console.log("setting SessionKeyUserStatsID ")
    sessionStorage.setItem('userID',userID)
  }
  removeSessionKeyUserStatsID(){
    console.log("removing SessionKeyUserStatsID ")
    sessionStorage.removeItem('userID')
  }
  private getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    //console.log('Token retrieved:', token);
    return token;
  }
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    console.log('Token set:', token)
  }
  private removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    console.log('Token removed');
  }
  private hasToken(): boolean {
    //double !! means if its a value. in other words if its null (return false) or not (return true)
    return !!this.getToken();
  }
}
