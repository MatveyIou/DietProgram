import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service'
import { Router, ActivatedRoute } from '@angular/router';

import { HeaderService } from './header.service';
import { lastValueFrom } from 'rxjs';

import { UserStatsResolver } from 'src/resolvers/user-stats.resolver';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  userData=this.activeRoute.snapshot.data['Data'];
  kcal_left:number | undefined
  kcal:number | undefined
  burned :number | undefined

  //@Input() elementRef!: ContentComponent;
  username!: string
  data: any;
  count=0

  //private changeSubscription!: Subscription;

  indexDisplay=0
  constructor(
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private headerService: HeaderService,
    private userStatsResolver:UserStatsResolver
  ) {
  }
  addBurnedCalories() {
    const input = prompt('Enter the number of calories to ADD:');
    if(input){
      const calories = parseInt(input);
      
      if (!isNaN(calories)) {
        // Display the entered calories to the user using an alert
        alert('Entered calories: ' + calories);
        this.burned!+=calories
        this.saveBurned()
        // You can update your data or perform any desired actions with the entered value
      } else {
        alert('Invalid input!');
      }
    }
      
  }
  removeBurnedCalories(){
    const input = prompt('Enter the number of calories to REMOVE:');

    if(input){
      const calories = parseInt(input);
      alert('Entered calories: ' + calories);
      this.burned!-=calories;
      this.saveBurned()
    }
  }
  async saveBurned(){
    await lastValueFrom(this.headerService.updateUserBurned(this.burned!,this.indexDisplay))
  }
  updateIndex(event:number){
    console.log("\x1b[41m"+"Header updateIndex()","Showing index:", event)
    this.indexDisplay=event
    this.updatePassableData()
  }
  public async getUpdatedData(){
    const newData = await lastValueFrom(this.userStatsResolver.resolve())
    this.userData=newData
    this.updatePassableData()
    
  }
  private async getUserName(): Promise<void> {
      this.username = await lastValueFrom(this.headerService.getUserName());
  }
  async ngOnInit(): Promise<void> {
    await this.getUserName();
    this.updatePassableData();
    this.htmlHeaderAnim()
  }
  updatePassableData() {
    
    this.kcal_left= this.userData.mainData[this.indexDisplay].kcal_left
    this.kcal= this.userData.mainData[this.indexDisplay].kcal
    this.burned = this.userData.mainData[this.indexDisplay].burned
  }

  logoutAction() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  htmlHeaderAnim() {
    var scrollCn = function (quantity: number) {
      var scrollTop = (window.pageYOffset || document.body.scrollTop) - (document.body.clientTop || 0);

      var size = 30 - ((scrollTop / quantity) || 0);
      var limiter = 10

      if (size <= limiter) {
        size = limiter;
      }
      document.querySelector('.up-button')!.setAttribute('style', 'visibility: hidden;');
      document.querySelector('.arrows')!.setAttribute('style', 'transform: scale(' + size / 30 + ', ' + size / 30 + ') ');
      document.querySelector('.bignadpis')!.setAttribute('style', 'transform: scale(' + size / 30 + ', ' + size / 30 + ') ');
      console.log(size)

      if (size <= limiter) {
        document.querySelector('.bignadpis')!.setAttribute('style', 'visibility: hidden;');
        document.querySelector('.arrows')!.setAttribute('style', 'visibility: hidden;');
        document.querySelector('.up-button')!.setAttribute('style', 'visibility: visible;');
      }
    };
    window.addEventListener('scroll', function () { scrollCn(12.5) });
  }


}
