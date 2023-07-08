import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { OffcanvasComponent } from '../offcanvas/offcanvas.component';

import { ActivatedRoute } from '@angular/router';
import { ICustomFood, IUserPreset, userData } from 'src/models/user-data.model';

import { Subscription, lastValueFrom } from 'rxjs';
import { SelectorService } from './selector.service';
import { UserCustomFoodResolver } from 'src/resolvers/user-custom-food.resolver';



@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.scss'],
})
export class SelectorComponent{
  @ViewChild(OffcanvasComponent) child: OffcanvasComponent | undefined

  @Output() valuePicked!: Subscription
  @Output() eventEmitterForHeader = new EventEmitter<any>();

  @Input() currentDateData!:IUserPreset
  selectedFood:ICustomFood[][]=[[],[],[],[]]
  canvasNumber!: number

  calorieDisplay:string[]=["Add BreakFast","Add Launch","Add Snack","Add Dinner"]
  calorieTotal:number[]=[0,0,0,0]
  docs: HTMLElement[] | undefined
  customFoods!: ICustomFood[][];

  constructor(private activeRoute: ActivatedRoute,
    private selectorService: SelectorService,
    private cdr: ChangeDetectorRef,
    private userCustomFoodResolver:UserCustomFoodResolver
    ){
      
    }
    makeChanges() {
      // Make your changes here
      
      // Trigger change detection in the header component
      
    }
  async fetchSelectedFood(){
    const response = await lastValueFrom(this.selectorService.getSelectedFood(this.currentDateData.date));
    this.selectedFood=response
    this.cdr.detectChanges();
    
    }

    
  async ngOnInit(): Promise<void> {
    console.log("\x1b[41m"+"selector init","this.currentDateData.date", this.currentDateData.date)
    await this.fetchSelectedFood()
    this.updateSumCalories()
  }


  ngAfterViewInit() {
    this.docs = [document.getElementById("myDiv0")!, document.getElementById("myDiv1")!, document.getElementById("myDiv2")!, document.getElementById("myDiv3")!]
  }

  async openStaticBackdrop(canvasNumber: number) {
    this.customFoods= await lastValueFrom(this.userCustomFoodResolver.resolve())
    this.child!.canvasNumber = canvasNumber
    this.child!.openStaticBackdrop()
    
  }
  removeClass() {
    this.docs!.forEach(element => {
      element.classList.remove("buttonCustomSection");
    });
  }
  addClass() {
    this.docs!.forEach(element => {
      element.classList.add("buttonCustomSection");
    });
  }

    newFoodPicked(event : { product: ICustomFood, canvasNumber: number }){
      console.log("emitted event ", event);
    
      // Check if the product already exists in the selectedFood array
      const index = this.selectedFood[event.canvasNumber]
      .findIndex(food => food._id === event.product._id);
    
      if (index !== -1)
        // If the product already exists remove it
        this.selectedFood[event.canvasNumber].splice(index, 1);
      else
        // if not
        this.selectedFood[event.canvasNumber].push(event.product);
    
      console.log(this.selectedFood);
    }
    toggleSelected(product:ICustomFood,indexType:number):void{

      this.selectedFood[indexType].push(product)
    }

    //todo re check this
    async updateMainData(event:any){
      try {
        const response = await lastValueFrom(this.selectorService.updateSelectedFood(this.currentDateData.date,this.selectedFood));
        console.log("Handle successful to update selected food", response);
        this.selectedFood=response
        this.cdr.detectChanges();
        //this.headerComponent.cdr.detectChanges();
        this.updateSumCalories();
        //todo this is a quick way of sending data to the header
        this.eventEmitterForHeader.emit()
        //this.passSelectedFoodEvent();
      } catch (error : any) {
        console.log("we caught an error", error);
        }
      
    }
    // passSelectedFoodEvent(){
    //   console.log("EVEN EMMITER: ",this.selectedFood)
    //   this.valueSelectedFoodPass.emit(this.selectedFood)
    // }

    updateSumCalories(){
      var sumNumbers=0
      console.log("\x1b[41m"+"updateSumCalories is called.","this is selectedFood:", this.selectedFood)
      for (let i = 0; i < this.selectedFood.length; i++) {
        this.selectedFood[i].forEach(foodType => {
          sumNumbers += foodType.kcal_total
        });
        this.calorieTotal[i]=sumNumbers
        sumNumbers=0
      }
    }
  }
  
  
  


