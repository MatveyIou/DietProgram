import { Controller, Get, Post, Body,Head,Headers,Request, UseGuards, ConflictException, Res, Delete, Param, Query, Put} from '@nestjs/common';
import { LoginService } from './login.service';


import { IUser } from '../user/dto/user.dto';
import { UserService } from 'src/user/user.service';

import { LocalAuthGuard } from '../auth/guard/local-auth.guard';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { IUserPreset } from 'src/user/dto/user-data.dto';

// TODO separate the routes. ie home to be standalone
@Controller('login')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private authService: AuthService,
    private userService:UserService
    ) {}
    DEFAULT = "\x1b[0m";
    BLUE = "\x1b[34m";
    GREEN = "\x1b[32m";
    YELLOW = "\x1b[33m";
    RED = "\x1b[31m";

    messageGET = this.BLUE+"GET."+this.DEFAULT
    messagePOST = this.GREEN+"POST."+this.DEFAULT
    messagePUT = this.YELLOW+"PUT."+this.DEFAULT
    messageDELETE = this.RED+"DELETE."+this.DEFAULT

  /**
   * Post Request should be at the end of the registration
   * When we have all the users data.
   */

  /**
    * @UseGuards is a decorator. we can understand it as a middleware for authentication
    * 
     * instead of using  @UseGuards(AuthGuard('local'))
     * we should create a file under auth and link it so we can use it as "LocalAuthGuard"
     * according to the documentation 
     * 
     * this is the login action
     */
   @UseGuards(LocalAuthGuard)
   @Post()
   async login(@Request() req) {
    console.log(this.messagePOST +"\nEmail: "+req.body.email)
    var res={
      _id: await (await this.userService.findOneUserByEmail(req.body.email)).id,
      access_token: (await this.authService.login(req.body)).access_token
    } 
    console.log("Result login ",res)
     return res
   }
   /**
    * registration action
    */
   @Post('reg-final')
  async create(@Body() userDto: IUser) {
    console.log(this.messagePOST,"\nregistration action")
    const userExists = await this.userService.findOneUserByEmail(userDto.email);
    if (userExists) {
      throw new ConflictException('User with this email already exists');
    }
    return this.userService.createUser(userDto);
  }
  //decorator @UseGuards probably redundant
   @UseGuards(JwtAuthGuard)
   @Get('home')
   async getProfile(@Headers('User_ID') userID:string) {
    console.log(this.messageGET,"\ntrying to get preset for:", userID)
    const res= await this.userService.findOneUserData(userID)
    if(!res)
      console.log("not found res")
    else
      console.log("found res")
    return res
   }
   /**
    * 
    * @param userID 
    * @returns gets the name of the user
    */
   @UseGuards(JwtAuthGuard)
   @Get('home/header')
   //we cant send plain string we have to use a json to send data
   async getUserName(@Headers('User_ID') userID:string) {
    console.log(this.messageGET,"\ntrying to get Name for the header:", (await this.userService.findOneUser(userID)).email)
    const res= {username: (await this.userService.findOneUser(userID)).username}
    if(!res)
      console.log("not Name found res")
    else
      console.log("found Name res")
    return res
   }
  //  /**
  //   * 
  //   * @param userID 
  //   * @returns gets all data for the user
  //   */
  //  @UseGuards(JwtAuthGuard)
  //  @Get('home/product')
  //  async getUserStats(@Headers('User_ID') userID:string) {
  //   console.log(this.messageGET,"\ntrying to get UserStats for:", (await this.userService.findOneUser(userID)).email)
  //   const res= await this.userService.findOneUserData(userID)
  //   if(!res)
  //     console.log("not found res")
  //   else
  //     console.log("found res", res)
  //   return res
  //  }
  @UseGuards(JwtAuthGuard)
   @Get('home/selectedproducts')
   async getUserStats(@Headers('User_ID') userID:string,@Headers('customdate') date:string) {
    console.log(this.messageGET,"\ntrying to get selected products for:", (await this.userService.findOneUser(userID)).email)
    const mainData= await (await this.userService.findOneUserData(userID)).mainData
    //console.log("MAINDATA ",mainData, "DATE", date)
    const res=mainData[mainData.findIndex(data => data.date === date)].selectedFood
    if(!res)
      console.log("not found res")
    else
      console.log("found res")
    return res
   }
   @UseGuards(JwtAuthGuard)
   @Put('home/burned/put')
   async updateBurnedCalorieData(@Headers('User_ID') userID:string,@Request() req,@Query('index') indexMainData:number) {
    const burned=req.body.burned
    console.log(this.messagePUT,"\ntrying to update Burned Calorie for:", (await this.userService.findOneUser(userID)).email)
    const userData= (await this.userService.findOneUserData(userID))
    userData.mainData[indexMainData].burned=burned;
    const res=  await userData.save();
    if(!res)
      console.log("not found res")
    else
      console.log("found update selected products res", res)
    return res
   }

   @UseGuards(JwtAuthGuard)
   @Put('home/selectedproducts/put')
   async updateUserStats(@Headers('User_ID') userID:string,@Headers('customdate') date:string,@Request() req ) {
    console.log(this.messagePUT,"\ntrying to update selected products for:", (await this.userService.findOneUser(userID)).email)
    //console.log("req.body: ", req.body)
    const mainData=await (await this.userService.updateSelectedFood(userID, date, req.body)).mainData
    const res = mainData[mainData.findIndex(data => data.date === date)].selectedFood
    if(!res)
      console.log("not found res")
    else
      console.log("found update selected products res", res)
    return res
   }
   /**
    * 
    * @param userID 
    * @returns customFood of the selected user
    */
   @UseGuards(JwtAuthGuard)
   @Get('home/products')
   async getCustomFood(@Headers('User_ID') userID:string) {
    console.log(this.messageGET,"\ntrying to get CUSTOM products for:", (await this.userService.findOneUser(userID)).email)
    const res= (await this.userService.findOneUserData(userID)).customFood
    if(!res)
      console.log("not found res")
    else
      console.log("found res")
    return res
   }
   /**
    * 
    * @param userID 
    * @returns Main data of the selected user
    */
   @UseGuards(JwtAuthGuard)
   @Get('home/data')
   async getDates(@Headers('User_ID') userID:string) {
    console.log(this.messageGET,"\ntrying to get number of Dates for:", (await this.userService.findOneUser(userID)).email)
    const res= (await this.userService.findOneUserData(userID)).mainData
    if(!res)
      console.log("not found res")
    else
      console.log("Data found res")
    return res
   }
   /**
    * pushes the new custom product to the db
    * @param userID user id to find
    * @param req the new custom product to push
    * @param indexType position of the first array
    * @returns 
    */
   @UseGuards(JwtAuthGuard)
   @Get('home/get/next')
   async getNextDate(@Headers('User_ID') userID:string) {
    console.log(this.messageGET,"\ntrying to get next mainDATA for:", (await this.userService.findOneUser(userID)).email)
    //console.log("req.body: ", req.body)
    const res= (await this.userService.addNextMainData(userID))
    if(!res)
      console.log("not found res for get next")
    else
      console.log(this.messageGET,"res for next", res)
    return res.mainData[res.mainData.length-1]
   }
   @UseGuards(JwtAuthGuard)
   @Put('home/product/put/edit')
   async updateCustomProduct(@Headers('User_ID') userID:string,@Request() req) {
    console.log(this.messagePUT,"\ntrying to edit customProduct for:", (await this.userService.findOneUser(userID)).email)
    //console.log("req.body: ", req.body)
    const res= (await this.userService.updateCustomFood(userID,req.body))
    if(!res)
      console.log("not found res for push")
    else
      console.log("res for push")
    return res
   }
   


   @UseGuards(JwtAuthGuard)
   @Delete('home/product/delete/:id')
   async deleteCustomProduct(@Headers('User_ID') userID:string,@Param('id') customProductID:string) {
    console.log(this.messageDELETE,"\ntrying to Delete customProduct for:", (await this.userService.findOneUser(userID)).email)
    //console.log("product id: ", customProductID)
    const res= (await this.userService.removeCustomFood(userID,customProductID))
    if(!res)
      console.log("not found res for push")
    else
      console.log("res for push")
    return res
   }
   @UseGuards(JwtAuthGuard)
   @Put('home/product/put')
   async pushCustomProduct(@Headers('User_ID') userID:string,@Request() req,@Query('index') indexType:number) {
    console.log(this.messagePUT,"\ntrying to push 1 customProduct for:", (await this.userService.findOneUser(userID)).email)
    console.log("req.body: ", req.body, "indexType: ", indexType)
    const res= (await this.userService.pushNewCustomFood(userID,req.body,indexType))
    if(!res)
      console.log("not found res for push")
    else
      console.log("res for push", res)
    return res
   }
   @UseGuards(JwtAuthGuard)
   @Get('validate')
   isValid(@Request() req) {
    //@UseGuards(JwtAuthGuard) should except the error
    console.log(this.messageGET+"\nlooks like the jwt is valid")
    return {isValid: true}
   }

  

}
