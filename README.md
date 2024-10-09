# DietProgram
A Fullstack Project made with Angular, NestJS and MongoDB.

# What is it?
Made as a final project for college and as an exercise in Web Development.
It's a simple calorie intake, Date tracker.<br>
The Fullstack application has:
## Login and Registration
A Login and Registration Functionality.
* Uses JWT to save users Login sessions. Users will be able to automatically Login when the session is not expired.
* Saves the Registration for each users in the Database.
* Check the validity of the users against the Database.
* With Registrations. The users can set their calorie intake "plan".
## Date Tracker
Users can scroll through his Dates to see their calorie intake.
* A Date builder. the users will be able to set their calorie intake when passing into a new Date.
* Dates are being saved in the database with their selected calorie(product) intake.
* Users are set on their current Date(computer Date) on Login. and any Date they had saved before hand, they will be able to see the past Dates.
## Product Selection and CRUD Functionality.
* Users will be able to select a product through 4 categories. it will be saved in the Database when they select them for each Date.
* CRUD functionality is enabled for the users to their products.

# How to run the project
## Prerequisites
First things first. you'll have to install node.JS and npm
```
https://nodejs.org
//after installing nodeJS and npm check at the terminal if you have nodeJS and npm
node -v
//should output the version of nodeJS
npm -v
//should output the version of npm
```
Afterwards we need to install AngularJS cli and nestJS cli
```
//Angular installation 
npm install -g @angular/cli
//after install check it
ng v
//should output the version
```
```
//NestJS installation 
npm install -g @nestjs/cli
//after install check it
nest -v
//should output the version
```
## Running it
We'll have to run the FrontEnd and BackEnd. <br>
Open two terminals and navigate to the FrontEnd and BackEnd.
## FrontEnd:
Navigate to the FrontEnd folder:
```
cd .\frontEnd\
```
and then to start the dev server run:
```
ng serve
```
## BackEnd:
Navigate to the BackEnd folder:
```
cd .\backEnd\
```
and then to start the dev server run:
```
nest start --watch
```
### Note:
If the database is closed(paused) the backend wont run!!! <br>
Becuase we are using MongoDB I manually need to open(resume) the Data base if its paused.
