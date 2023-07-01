import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, firstValueFrom,Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environment/environment';
import { Router } from '@angular/router';
import { UserStatsResolver } from 'src/resolvers/user-stats.resolver';
import { ICustomFood, IUserPreset } from 'src/models/user-data.model';

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

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  /**
   * Login action. sets the user jwt and their season key
   * 
   * the post<LoginResponse>() returns an Observable
   * pipe() is "basically" a collection of functions that we can "chain" together
   * tap() is the operator that lets as do actions without modifying the emission
   * 
   * we will .subscribe() to this method.
   * when the response complete from the post method. then it will emit the value.
   * the emitted response will immediately complete(and then CLOSES the subscription when it is emitted)
   * and THEN it will return
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

          this.setSessionKeyUserStatsID(response._id);
        })
      );
  }
  /**
   * Will remove the existing jwt token. and set the "isAuthenticated" to false to emit that the user is NOT Authenticated anymore
   * 
   * when we run this line: "this.isAuthenticated$.next(false);" it will emit and "trigger" the subscription
   * (we are subscribing to the observable using )
   */
  logout(): void {
    this.removeToken();
    this.isAuthenticated$.next(false);
    this.removeSessionKeyUserStatsID()
    this.redirect()
    console.log("logged out")
  }

  getIsAuthenticated(): Observable<boolean> {
    return this.isAuthenticated$.asObservable();
  }
  subscribeIsAuthenticatedObservable(): Subscription {
    return this.getIsAuthenticated().subscribe(isAuthenticated => {
      console.log("Subscribing to isAuthenticated")
      if (isAuthenticated) {
        // Redirect to another page if the user is already authenticated
        console.log("looks like you are already logged in. Login")
        this.router.navigate(['/login/home']);
      }
      else
        console.log("looks like the user is not authenticated")
    });
  }
  unsubscribeIsAuthenticatedObservable(IsAuthenticatedSubscription:Subscription): void{
    console.log("\u001b[31m"+"Unsubscribing from isAuthenticated")
    IsAuthenticatedSubscription.unsubscribe()
  }

  getData(route: string): Observable<any> {// TODO BACK END PRODUCTS
    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.getToken(),
      User_ID:this.getSessionKeyUserStatsID()!
    });
    return this.http.get(this.baseUrl + route, {headers});
  }
  getSelectedFoodData(route: string,date:string): Observable<any> {// TODO BACK END PRODUCTS
    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.getToken(),
      User_ID:this.getSessionKeyUserStatsID()!,
      customdate:date!
    });
  
    return this.http.get(this.baseUrl + route, {headers});
  }
  updateSelectedFoodData(route: string,date:string,selectedFood:ICustomFood[][]): Observable<any> {// TODO BACK END PRODUCTS
    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.getToken(),
      User_ID:this.getSessionKeyUserStatsID()!,
      customdate:date!
    });
    return this.http.put(this.baseUrl + route,selectedFood, {headers});
  }
  updateNextNewData(): Observable<IUserPreset>{
    const headers = new HttpHeaders({
      Authorization: "Bearer " + this.getToken(),
      User_ID:this.getSessionKeyUserStatsID()!
    });
    return this.http.get<any>(this.baseUrl+"/home/get/next",{headers})
  }
  pushCustomProduct(newProduct:ICustomFood,indexType:number): Observable<any>{
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
  /**
   * checks the authenticity of the jwt of the user, updates it and return the updated value
   * @returns the updated isAuthenticated 
   */
  async getIsValid() {
    await this.checkTokenValidity();
    return this.isAuthenticated$;
  }
  
  private async checkTokenValidity(): Promise<void> {
    console.log("\x1b[33m"+"checking for Validity")
    try {
      const response = await firstValueFrom(this.validateToken());
      if (response!.isValid) {
        console.log("\x1b[32m"+'Token is Valid!');
      } else {
        console.log("\x1b[31m"+'Token is InValid! setting it to false');
        this.logout()
      }
    } catch (error) {
      console.log("Error validating token, need to log out", error);
      this.logout()
    }
  }
  /**
   * TODO check if sending jwt to validate is correct with header
  */
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
    //console.log("getting SessionKeyUserStatsID ",sessionStorage.getItem('userID'))
    return sessionStorage.getItem('userID')
  }
  setSessionKeyUserStatsID(userID:string){
    //console.log("setting SessionKeyUserStatsID ")
    sessionStorage.setItem('userID',userID)
  }
  removeSessionKeyUserStatsID(){
    //console.log("removing SessionKeyUserStatsID ")
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
