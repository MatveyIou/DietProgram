import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AuthService } from '../../Auth/auth.service'
import { Router,ActivatedRoute } from '@angular/router';
import { userData } from '../../models/user-data.model';
import { ContentComponent } from '../content/content.component';
import { HeaderService } from './header.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  userData!: userData
  @Input() elementRef!: ContentComponent;
  username!:string
  constructor(
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private headerService:HeaderService
  ) {
 this.fetchData()//todo this maybe redandent
  }


  async fetchData() {
    try {
      this.userData = await this.activeRoute.snapshot.data['Data'];
      console.log("HEADER fetchData inside of constrictor", this.userData);
      await this.getUserName();
    } catch (error) {
      console.error(error);
    }}

  private async getUserName():Promise<void>{
    try {
    const response = await lastValueFrom(this.headerService.getUserName());
      console.log("Handle successful response ", response);
      this.username=response
    } catch (error : any) {
      console.log("we caught an error", error);
      this.username=error
    }
  }
  async ngOnInit(): Promise<void> {
    console.log("HEADER ngOnInit", this.username)
    //this.userData= await this.activeRoute.snapshot.data['Data'];
    console.log(this.userData)
    this.getUserName()
    this.htmlHeaderAnim()
  }
  selectorDate(){
    return 0
  }
  logoutAction() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  //TODO scrollToDate(){ 
  //   this.elementRef.scrollToTop();
  // }
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
