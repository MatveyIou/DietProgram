import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import{AuthService} from '../../Auth/auth.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit  {
  clickedButton:string="";
  loginForm: FormGroup|any;
  isRegistered: boolean = false;
  private isAuthenticatedSubscription: Subscription | undefined;
  
  /**
   * Contractor runs before the component fully initialized
   * We are "Injecting" these services so we can use them in the component"
   * 
   * @param formBuilder Service, a "reactive" form. used to control the forms in the component
   * @param router Service, used to navigate to different pages
   */
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}
  checkInitParams(){
    this.activatedRoute.queryParams.subscribe(params => {
      const isRegistered = params['isRegistered'];
      if (isRegistered) {
        // do something with the isRegistered parameter
        this.isRegistered=isRegistered
      }
    });
  }
  loginFormBuilder(){
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  /**
   * IF if we store subscribed observables as variables(using subscription from rxjs)
   * due to nature of angular we HAVE TO DELETE!!! unused observables when we .subscribe() to them.
   * only IF those observables are gotten from service(or outside of current component).
   * if we don't it may cause memory leaks!
   * we can use ngOnDestroy()
   * 
   * but if its contained in the same component it will be deleted automatically
   */
  ngOnInit(): void {
    this.isAuthenticatedSubscription = this.authService.getIsAuthenticated().subscribe(isAuthenticated => {
      //console.log("getIsAuthenticated "+isAuthenticated)
      if (isAuthenticated) {
        // Redirect to another page if the user is already authenticated
        console.log("looks like you are already logged in")
        this.router.navigate(['/login/home']);
      }
    });

    this.checkInitParams()
    this.loginFormBuilder() 
  }
  ngOnDestroy() { 
      this.isAuthenticatedSubscription!.unsubscribe();
  }
  async changeButtonClickType(str:string){
    this.clickedButton = str;
  }
  //
  onSubmit() {
    if (this.loginForm.valid) {
      if(this.clickedButton=="login")
        this.loginAction()
      else
        this.registrationAction()
        
      console.log("We have this data: ","Email: "+ this.loginForm.value.email+" Password: "+this.loginForm.value.password);
  }
  else if (this.clickedButton=="register"){
    this.registrationAction()
  }
  else{
    console.log("Bad data in form");
  }
  this.clickedButton="";
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
      // Store the access token in local storage
      this.authService.login(email,password);
      // Redirect the user to the desired page
      this.router.navigate(['/login/home']);
    },
    error: error => {
      console.log("we send ",email, password)
      console.log('Login error', error);
      // Display an error message to the user
      // (You can create a variable in the component to hold the error message and display it in the HTML)
    }
  });
  }
    /**
     * Go to the registration screen and start the registration  
     */
  registrationAction() {
    const route='login/reg-final'
    this.router.navigate([route])
    console.log("navigating to "+ route)
  }
}


