import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.scss'],
  animations: [
    trigger('fadeInAnimation', [
      state('void', style({ opacity: 0 })),
      transition(':enter, :leave', [
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class RegComponent {
  
  showDateInput = false;
  selectedDate: string | undefined;
  showResult = false;
  result: string | undefined;
  isSuccess=false
  constructor(
    private router: Router) {}
  checkAge() {
    const birthDate = new Date(this.selectedDate!);
    const age = Math.floor((Date.now() - birthDate.getTime()) / 31557600000); // Calculate age in years (assuming 365.25 days per year)

    if (age >= 16) {
      this.isSuccess = true;
      this.result = 'Registration successful! Redirecting to a different page...';
      setTimeout(() => {
        // Perform the redirect to a different page here
        this.showResult = false;
        this.router.navigate(['/login/reg-final']);
      }, 1000);
    } else if (age < 16) {
      this.result = 'You must be at least 16 years old to register.';
    }
    else{
      this.result = 'You must enter a date to register';
    }

    this.showResult = true;

}
updateGradient(event: MouseEvent) {
  const button = event.target as HTMLElement;
  const rect = button.getBoundingClientRect();
  const posX = event.clientX - rect.left;
  const posY = event.clientY - rect.top;
  const percentX = (posX / rect.width) * 100;
  const percentY = (posY / rect.height) * 100;

  button.style.backgroundPosition = `${percentX}% ${percentY}%`;
}
}
