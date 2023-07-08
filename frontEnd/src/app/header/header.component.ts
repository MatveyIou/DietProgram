import { ChangeDetectorRef, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service'
import { Router, ActivatedRoute } from '@angular/router';
import { ICustomFood, IUserPreset, userData } from '../../models/user-data.model';
import { ContentComponent } from '../content/content.component';
import { HeaderService } from './header.service';
import { Subscription, lastValueFrom } from 'rxjs';
import { HomeService } from '../home/home.service';
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
    private cdr: ChangeDetectorRef,
    private userStatsResolver:UserStatsResolver
  ) {
  }
  updateIndex(event:number){
    console.log("we have index number", event)
    this.indexDisplay=event
    this.updatePassableData()
  }
  // ngDoCheck() {
  //   this.count+=1
  //   if (this.changeSubscription) {
  //     this.changeSubscription.unsubscribe();
  //   }
  //   //TODO find another way of getting data from selector this function runs alot of times

  //   this.changeSubscription = this.sharedService.dataObservable.subscribe(data => {
  //       console.log("changes made for the HEADER",this.count);
  //     });
    
  // }
  public async getUpdatedData(){
    const newData = await lastValueFrom(this.userStatsResolver.resolve())
    this.userData=newData
    console.log(newData,"LOL")
    this.updatePassableData()
    
  }
  private async getUserName(): Promise<void> {
      this.username = await lastValueFrom(this.headerService.getUserName());
  }
  async ngOnInit(): Promise<void> {
    await this.getUserName();
    this.updatePassableData();
    this.htmlHeaderAnim()
    //this.userData.mainData[this.indexDisplay].carbs=100
  }
  updatePassableData() {
    
    this.kcal_left= this.userData.mainData[this.indexDisplay].kcal_left
    this.kcal= this.userData.mainData[this.indexDisplay].kcal
    this.burned = this.userData.mainData[this.indexDisplay].burned
    console.log("NEW CHENGES!!!",this.kcal_left,this.kcal,this.burned)
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
