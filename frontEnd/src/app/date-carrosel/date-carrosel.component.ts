import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbCarousel, NgbCarouselConfig, NgbCarouselModule, NgbSlide, NgbSlideEvent } from '@ng-bootstrap/ng-bootstrap';
import { NgFor, NgIf } from '@angular/common';
import { count, last, lastValueFrom } from 'rxjs';
import { ICustomFood, IUserPreset, userData } from 'src/models/user-data.model';
import { ActivatedRoute, Data } from '@angular/router';
import { DateCarroselService } from './date-carrosel.service';
//TODO redesign the dates so it will get from db data
@Component({
  selector: 'app-date-carrosel',
  templateUrl: './date-carrosel.component.html',
  styleUrls: ['./date-carrosel.component.scss'],
  providers: [NgbCarouselConfig,]
})
export class DateCarroselComponent implements OnInit {
  @ViewChild('carousel') carousel!:NgbCarousel

  userData:userData= this.activeRoute.snapshot.data['Data']
  userDatesCarousel:string[]=[]

  @Output() valueChanged = new EventEmitter<userData["mainData"]>();

  posIni: any;
  activeIndex: number=0
  
  showNavigationArrows = true;
  showNavigationIndicators = false;
  count : number= 2;
  currentDateData:any;

  constructor(private activeRoute: ActivatedRoute,
    private dateCarroselService:DateCarroselService){
      this.getUserDatesCarousel()
    }

  async getUserDatesCarousel():Promise<void>{
    this.userData.mainData.forEach(data => {
      this.userDatesCarousel.push(data.date)
    });
  }

  async ngOnInit(): Promise<void> {
    console.log("\x1b[34m"+"ngONInit this.userDatesCarousel ",this.userDatesCarousel)
    this.addDate();
    this.setDateData();
  }
  private addDate(): void{
    
    const lastDateStats= this.userDatesCarousel[this.userDatesCarousel.length-1].split("/")//dd/mm/yy
    console.log("lastDateStats ",lastDateStats)
    const nextDate= new Date("20"+lastDateStats[2]+"/"+lastDateStats[1]+"/"+lastDateStats[0])
    nextDate.setDate(nextDate.getDate()+1)
    console.log("nextDate ",nextDate)
    this.userDatesCarousel.push(nextDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }))
    //this.userDatesCarousel[indexAdd].setDate(this.userDatesCarousel[0].getDate()+indexAdd);
    console.log("we have an a date at index", this.userDatesCarousel.length-1,"\nthis is the userDatesCarousel now", this.userDatesCarousel)
    // console.log(this.dates);
  }

  addDateDay(event: NgbSlideEvent): void {
    this.activeIndex = parseInt(event.current.slice(10))
    console.log("Count: "+this.count+"  Slide Index: "+this.activeIndex)

    if(event.direction === "start" && this.count-1 === this.activeIndex)
    {
      this.addDate()
      this.count++;
    }
  }

  nextClick(){
    this.carousel.next()
    this.activeIndex++
    this.setDateData()
    
  }
  prevClick(){
    this.carousel.prev()
    if(this.activeIndex>=1)
      this.activeIndex--
      this.setDateData()
  }
  
  /**
   * Move the date with smartphone slide
   * @param pos 
   */
  move(pos:number) {
    const offset = this.posIni - pos;
    if (offset < -100) this.carousel!.prev()

    if (offset > 100) this.carousel!.next();
  }
  setDateData(){
    console.log("We are setting this data!!! ",this.userData.mainData[this.activeIndex])
    this.currentDateData = this.userData.mainData[this.activeIndex]
  }

  passUserProductUpdate(event:ICustomFood[][]){
    this.valueChanged.emit(this.buildMainData(event))
  }
  buildMainData(event:ICustomFood[][]):IUserPreset[]{
    const newMainData: IUserPreset[]=[]

    this.userDatesCarousel.forEach(date => {
      newMainData.push(this.newMainData(date,event))
    });
    return newMainData
  }
  newMainData(date:string,event:ICustomFood[][]):IUserPreset{
    return{
      date:date,
      kcal: this.sumSelectedCalorieSelectedFood(event, 'kcal_total'),
      kcal_left: 0,
      burned: 0,
      carbs_total:0,
      carbs: this.sumSelectedCalorieSelectedFood(event, 'carbs'),
      protein_total:0,
      protein: this.sumSelectedCalorieSelectedFood(event, 'protein'),
      fat_total:0,
      fat: this.sumSelectedCalorieSelectedFood(event, 'fat'),
      selectedFood: event
    }
  }
  sumSelectedCalorieSelectedFood(event:ICustomFood[][],prop: keyof ICustomFood):number{
    var sum=0
    const variable= prop
    event.forEach(type => {
      type.forEach(food=>{
          sum += Number(food[variable])
      })
    });
    return sum
  }
}
