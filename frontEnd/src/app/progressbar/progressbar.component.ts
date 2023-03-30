import { Component, Input } from '@angular/core';
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

  ngOnInit(): void {
    this.total_kcal_left= this.kcal_left - this.kcal + this.burned
    this.percent_kcal=this.calcPercent();
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
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
