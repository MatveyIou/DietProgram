import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
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
  @ViewChild('carousel') carousel!: NgbCarousel

  userData: userData = this.activeRoute.snapshot.data['Data']!
  userDatesCarousel: string[] = []

  @Output() valueChanged = new EventEmitter<userData["mainData"]>();

  posIni: any;
  activeIndex: number = 0

  showNavigationArrows = true;
  showNavigationIndicators = false;
  count: number = 2 ;
  currentDateData=this.userData.mainData


  constructor(private activeRoute: ActivatedRoute,
    private dateCarroselService: DateCarroselService,
    private cdr: ChangeDetectorRef) {
    this.getUserDatesCarousel()
  }

  async getUserDatesCarousel(): Promise<void> {
    this.userData.mainData.forEach(data => {
      this.userDatesCarousel.push(data.date)
    });
  }

  async ngOnInit(): Promise<void> {
    this.addDateTemp();
    console.log("this.activeIndex",this.activeIndex)
    console.log("\x1b[41m" + "date-carrosel init","this.userDatesCarousel", this.userDatesCarousel)
  }
  private addDateTemp(): void {
    if(this.activeIndex>=this.userDatesCarousel.length-1){
    const lastDateStats = this.userDatesCarousel[this.userDatesCarousel.length - 1].split("/")//dd/mm/yy
    const nextDate = new Date("20" + lastDateStats[2] + "/" + lastDateStats[1] + "/" + lastDateStats[0])
    nextDate.setDate(nextDate.getDate() + 1)
    this.userDatesCarousel.push(nextDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }))
    console.log("adding userDatesCarousel")
    this.setNextNewData()
    }
    else{
      console.log("userDatesCarousel doesnt need another date")
    }
    //this.synchroniesDateData()
  }
  private async synchroniesDateData(){
    while(this.currentDateData.length<this.userDatesCarousel.length)
      await this.setNextNewData()
  }
  async addDateDay(event: NgbSlideEvent): Promise<void> {
    this.activeIndex = parseInt(event.current.slice(10))
    console.log("Count: " + this.count + "  Slide Index: " + this.activeIndex)

    if (event.direction === "start" && this.count - 1 === this.activeIndex) {
      this.addDateTemp()
      this.count++;
    }
  }

  async nextClick() {
    this.carousel.next()
    this.activeIndex++
  }
  prevClick() {
    this.carousel.prev()
    if (this.activeIndex >= 1){
      this.activeIndex--
    }
  }
  async setNextNewData() {
    const newValue:IUserPreset = await lastValueFrom(this.dateCarroselService.getNextNewData())
    this.cdr.detectChanges()
    console.log("newValue",newValue)
    // const fixedValue ={
    //   date: newValue.date,
    //   kcal: newValue.kcal,
    //   kcal_left: newValue.kcal_left,
    //   burned: newValue.burned,
    //   carbs_total: newValue.carbs_total,
    //   carbs: newValue.carbs,
    //   protein_total: newValue.protein_total,
    //   protein: newValue.protein,
    //   fat_total: newValue.fat_total,
    //   fat: newValue.fat,
    //   selectedFood: newValue.selectedFood
    // }
    // console.log("newValue",fixedValue)
    this.currentDateData.push(newValue)
    console.log("\x1b[34m" + "This is our new this.currentDateData", this.currentDateData)
}

  hasNext(){
    console.log("hasNext()", this.activeIndex+1<=this.currentDateData.length-1)
    return this.activeIndex+1<=this.currentDateData.length-1
  }
  hasDate(date:string){
    const data= this.userData.mainData.find(mainData => mainData.date === date);
    if(data)
      return true
    return false
  }

  /**
   * Move the date with smartphone slide
   * @param pos 
   */
  move(pos: number) {
    const offset = this.posIni - pos;
    if (offset < -100) this.carousel!.prev()

    if (offset > 100) this.carousel!.next();
  }
  passUserProductUpdate(event: ICustomFood[][]) {
    const newMainData = this.buildMainData(event)
    console.log("There is new IUserPreset[] Emiter: ", newMainData)
    this.valueChanged.emit(newMainData)
  }

  buildMainData(event: ICustomFood[][]): IUserPreset[] {
    const newMainData: IUserPreset[] = []

    this.userDatesCarousel.forEach(date => {
      newMainData.push(this.newMainData(date, event))
    });
    return newMainData
  }

  newMainData(date: string, event: ICustomFood[][]): IUserPreset {
    return {
      date: date,
      kcal: this.sumSelectedCalorieSelectedFood(event, 'kcal_total'),
      kcal_left: 0,
      burned: 0,
      carbs_total: 0,
      carbs: this.sumSelectedCalorieSelectedFood(event, 'carbs'),
      protein_total: 0,
      protein: this.sumSelectedCalorieSelectedFood(event, 'protein'),
      fat_total: 0,
      fat: this.sumSelectedCalorieSelectedFood(event, 'fat'),
      selectedFood: event
    }
  }

  sumSelectedCalorieSelectedFood(event: ICustomFood[][], prop: keyof ICustomFood): number {
    var sum = 0
    const variable = prop
    event.forEach(type => {
      type.forEach(food => {
        sum += Number(food[variable])
      })
    });
    return sum
  }
}
