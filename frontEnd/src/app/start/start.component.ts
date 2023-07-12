import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import{AuthService} from '../../auth/auth.service'
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit, OnDestroy{
  projectName="Diet program®"
  projectDes="Health is our goal"
  isAuthenticatedSubscription: Subscription | undefined;
  
  constructor(
    private authService: AuthService,
    private router: Router) {}
  
  ngOnInit(): void {
    this.isAuthenticatedSubscription=this.isAuthenticatedSubscription=this.authService.subscribeIsAuthenticatedObservable()
  }
  ngOnDestroy(): void {
    this.authService.unsubscribeIsAuthenticatedObservable(this.isAuthenticatedSubscription!)
  }
  goToLogin(){
    this.router.navigate(['/login']);
  }
  goToSighUp(){
    this.router.navigate(['/login/reg']);
  }
}
