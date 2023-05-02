import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../auth/auth.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup | any;
  isRegistered: boolean = false;
  errorMessage: string | undefined;
  isAuthenticatedSubscription: Subscription | undefined;

  /**
   * Contractor runs before the component fully initialized.
   * We are "Injecting" these services so we can use them in the component.
   * 
   * @param formBuilder Service, a "reactive" form. used to control the forms in the component.
   * @param router Service, used to navigate to different pages.
   * @param activatedRoute Service, used to access parameters with the current route.
   * @param authService Service, a custom service ive made to handle the authentication of user.
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }
  /**
   * We will get a param in the url login?isRegistered=true|
   * it will be set from the reg-final component
   */
  checkInitParams() {
    this.activatedRoute.queryParams.subscribe(params => {
      const isRegistered = params['isRegistered'];
      if (isRegistered) {
        // do something with the isRegistered parameter
        this.isRegistered = isRegistered
      }
    });
  }
  /**
   * builds a form using FormBuilder.
   * to get data from the user
   */
  loginFormBuilder() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  /**
   * IF we subscribe to observables (using subscription from rxjs)
   * due to nature of angular we HAVE TO DELETE!!! unused observables when we .subscribe() to them.
   * (sometimes we dont have to. it will do automatically)
   * we need to delete those observables component.
   * if we don't delete them. they may cause memory leaks!
   * we can use ngOnDestroy()
   * 
   * //but if its contained in the same component it will be deleted automatically
   */
  ngOnInit(): void {
    this.isAuthenticatedSubscription = this.authService.subscribeIsAuthenticatedObservable()

    this.checkInitParams()
    this.loginFormBuilder()
  }
  ngOnDestroy() {
    this.authService.unsubscribeIsAuthenticatedObservable(this.isAuthenticatedSubscription!)
  }
  /**
   * submitting the form
   * @param strAction button type pressed
   */
  onSubmit(strAction: string) {
    console.log("We have this data: ", "Email: " + this.loginForm.value.email + " Password: " + this.loginForm.value.password);

    if (strAction == "login") {
      if (this.loginForm.valid)
        this.loginAction()
      else
        console.log("Bad data in form");
    }
    else if (strAction == "register")
      this.registrationAction()
  }
  /**
   * Go to the home screen and start the app
   */
  loginAction() {
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe({
      next: response => {
        console.log('Login successful', response);
        // will unsubscribe automatically
      },
      error: error => {
        console.log("we send ", email, password)
        console.log('Login error', error);
        // Display an error message to the user
        this.errorMessage = "Email or Password is incorrect"
        // will unsubscribe automatically
      }
    });
  }
  /**
   * Go to the registration screen and start the registration  
   */
  registrationAction() {
    const route = 'login/reg-final'
    this.router.navigate([route])
    console.log("navigating to " + route)
  }
}


