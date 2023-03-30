# DietProgram
A Fullstack Project made with Angular, NestJs and MongoDB.

# What is it?
Made as a final project for college and as an exercise in Web Development.
It's a simple calorie intake, Date tracker.<br>
The Fullstack application has:
## Login and Registration
A Login and Registration Functionality.
* Uses JWT to save users Login sessions. Users will be able to automatically Login when the session is not expired.
* Saves the Registration for each users in the Database.
* Check the validity of the users against the Database.
* With Registrations. The users can set thier calorie intake "plan".
## Date Tracker
Users can scroll through his Dates to see thier calorie intake.
* A Date builder. the users will be able to set thier calorie intake when passing into a new Date.
* Dates are being saved in the database with thier selected calorie(product) intake.
* Users are set on thier current Date(computer Date) on Login. and any Date they had saved before hand, they will be able to see the past Dates.
## Product Selection and CRUD Functionality.
* Users will be able to select a product through 4 categories. it will be saved in the Database when they select them for each Date.
* ~~Users can create new products to each category.~~
* CRUD functionality is enabled for the users to thier products.

# How to run the project
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
