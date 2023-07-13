import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DateCarroselComponent } from './date-carrosel/date-carrosel.component';
import { ContentComponent } from './content/content.component';
import { FontAwesomeModule,FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { SelectorComponent } from './selector/selector.component';
import { OffcanvasComponent } from './offcanvas/offcanvas.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RegComponent } from './reg/reg.component';
import { RegFinalComponent } from './reg/reg-final/reg-final.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserStatsResolver } from 'src/resolvers/user-stats.resolver';

import { UserCustomFoodResolver } from 'src/resolvers/user-custom-food.resolver';
import { UserDateResolver } from 'src/resolvers/user-date.resolver';
import { StartComponent } from './start/start.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    DateCarroselComponent,
    ContentComponent,
    SelectorComponent,
    OffcanvasComponent,
    ProgressbarComponent,
    RegComponent,
    RegFinalComponent,
    StartComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot([
      {path: 'login/home', component: HomeComponent,
      canActivate: [AuthGuard],resolve:{ Data:UserStatsResolver,  Custom_Food:UserCustomFoodResolver},},//Carousel_Data: UserDateResolver
      {path: '',component: StartComponent},
      {path: 'login', component: LoginComponent},
      {path: 'login/reg-final', component: RegFinalComponent},
      {path: 'login/reg', component: RegComponent},
    ]),
    NgbModule,
    FontAwesomeModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTooltipModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIconPacks(fas, far);
  }
}
