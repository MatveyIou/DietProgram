import { Component, Input, SimpleChanges } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.scss']
})
export class ProgressbarComponent {
  @Input() kcal_left!: number
  @Input() kcal!: number
  @Input() burned!: number
  percent_kcal: number | undefined;
  total_kcal_left: number | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes)
    if (changes['kcal'] || changes['burned']) {
      this.calcSum();
    }
  }
  ngOnInit(): void {
    this.calcSum()
  }
  calcSum(){
    this.total_kcal_left= this.kcal_left - this.kcal + this.burned
    this.percent_kcal=this.calcPercent();
  }
  /**
   * calcs the percent that the person has left to eat
   */
  private calcPercent(){
    return this.total_kcal_left!/this.kcal_left*100
  }
  private absPercent( num:number){
    return num*-1+100
  }
}
