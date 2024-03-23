import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RegFinalService } from './reg-final.service';
import { IUser } from "../../../models/user.model"

import { tap, catchError } from 'rxjs/operators';
import { Observable, lastValueFrom, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reg-final',
  templateUrl: './reg-final.component.html',
  styleUrls: ['./reg-final.component.scss']
})
export class RegFinalComponent implements OnInit {
  errorMessage: string | undefined;
  registrationForm: FormGroup | any;

  constructor(
    private formBuilder: FormBuilder,
    private regFinalService: RegFinalService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      confirmPassword: ['', Validators.required]
    },
      {
        validator: this.matchingPasswords('password', 'confirmPassword')
      });
  }
  goToLogin(){
    this.router.navigate(['/login']);
    
  }
  /**
   * 
   * @param passwordKey 
   * @param confirmPasswordKey 
   * @returns 
   */
  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup) => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];

      if (password.value !== confirmPassword.value) {
        return confirmPassword.setErrors({ mismatchedPasswords: true })
      }
    }
  }
  adminNameValidator(name: string):boolean {
    return name.startsWith('Admin@')
  }

  onSubmit() {
    console.log(this.registrationForm!.value);

    const user: IUser = {
      username: this.registrationForm.get('name').value,
      password: this.registrationForm.get('password').value,
      email: this.registrationForm.get('email').value
    };

    //console.log(user);
    this.registerUser(user);
  }

  async registerUser(user: IUser) {
    /**
     * subscribe() is basically a promise but empty
     * instead of using subscribe(). for example:
     * 
     * this.regFinalService.registerUser(user)
    .subscribe({
      next: response => {
        console.log("Handle successful response ", response)
        this.user = response;
        this.registrationForm.reset();
      },
      error: error => {
        console.log("we caught and error", error)
        if (error.status === 409) {
          this.errorMessage = 'Email is already registered';
        } else {
          this.errorMessage = 'An error occurred';
        }
      }
    });
      * we will use a promise() and try catch
      * but we should use lastValueFrom() because its departed 
     */
    try {
      const response = await lastValueFrom(this.regFinalService.registerUser(user));
      console.log("Handle successful response ", response);
      this.registrationForm.reset();
      this.router.navigate(['/login'], { queryParams: { isRegistered: true } });
    } catch (error : any) {
      console.log("we caught an error", error);
      if (error.status === 409) {
        this.errorMessage = 'Email is already registered';
      } else {
        this.errorMessage = 'An error occurred';
      }
    }
    console.log(this.errorMessage)
  }

}
