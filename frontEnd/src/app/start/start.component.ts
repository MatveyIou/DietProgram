import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent {
  projectName="Diet program®"
  projectDes="Health is our goal"
  
  constructor(private router: Router) {}
  
  goToLogin(){
    this.router.navigate(['/login']);
  }
  goToSighUp(){
    this.router.navigate(['/login/reg-final']);
  }
}
