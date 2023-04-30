import { Component } from '@angular/core';
import { Router } from '@angular/router';
import{AuthService} from '../../auth/auth.service'
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {
  projectName="Diet program®"
  projectDes="Health is our goal"
  isAuthenticatedSubscription: Subscription | undefined;
  
  constructor(
    private authService: AuthService,
    private router: Router) {}
  
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.isAuthenticatedSubscription=this.isAuthenticatedSubscription=this.authService.subscribeIsAuthenticatedObservable()
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.authService.unsubscribeIsAuthenticatedObservable(this.isAuthenticatedSubscription!)
  }
  goToLogin(){
    this.router.navigate(['/login']);
  }
  goToSighUp(){
    this.router.navigate(['/login/reg-final']);
  }
}
