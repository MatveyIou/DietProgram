import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
//the whole purpose of this guard to check is the user is validated before rendering the page
export class AuthGuard implements CanActivate {

  
  constructor(private authService: AuthService) {}

  async canActivate(): Promise<boolean> {
    console.log("\x1b[0;32m"+"checking authenticity with Auth.guard.ts" )
    //.toPromise() is departed
    //firstValueFrom() is used to get the first emit(or the first valve)
    const isAuth= await firstValueFrom(this.authService.getIsAuthenticated())
    console.log("Authenticated is ",isAuth)
    return isAuth;
  }
}
