import { Component, EventEmitter } from '@angular/core';
import{AuthService} from '../../auth/auth.service'
import { ActivatedRoute, Router } from '@angular/router';
import { userData } from '../../models/user-data.model';
import { HomeService } from '../home/home.service'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  // valueChanged = new EventEmitter<userStats>();
  userStats!:userData
  userDates!:Date[]
  //userProducts!: userProducts

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private activeRoute: ActivatedRoute,
    private homeService: HomeService,)
  {}
    //looks like using angular "Resolve" router makes sure the we will get data saved before the page is rendered
  async ngOnInit(): Promise<void> {
    
    //this.userStats=  this.activeRoute.snapshot.data['Data'];//this gets data from resolve() from header.resolve.ts  //TODO a secure way
    //this.userDates= this.userStats.mainData.map(preset  => new Date(preset.date))
    //this.userProducts.userCustomProduct
    //console.log(this.userProducts.userCustomProduct)
  }

  // setStatsDB() {
  //   this.homeService.getStats().subscribe({
  //     next: dataStats => {
  //       this.userStats = dataStats;
  //       console.log('Saved statObj with', dataStats);
  //     },
  //     error: error => {
  //       console.log('Error getting user stats:', error);
  //     }
  //   });
  // }
  // passUserProductUpdate(event:userStats){
  //   this.userStats=event
  //   console.log("home updated user product", this.userStats)
  // }
  checkDate(){
    console.log("function from homeComponent this.userStats ",this.userStats)
    console.log("function from homeComponent this.userDate ",this.userDates)
  }
}
