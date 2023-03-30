import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
//the whole purpise of this guard to check is the user is validated before rendering the page
export class AuthGuard implements CanActivate {

  isAuthenticated = false
  isValid = false
  
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

    await this.authService.getIsAuthenticated().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;
    });
    (await this.authService.getIsValid()).subscribe((isValid) => {
      this.isValid=isValid
    });
    
    if (this.isAuthenticated && this.isValid) 
      return true;
    
    this.router.navigate(['/login']);
    return false;
  }
}
