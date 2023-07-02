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
   async pushCustomProduct(@Headers('User_ID') userID:string) {
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
   
  //  @UseGuards(JwtAuthGuard)
  //  @Put('home/')

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
  //  private makeDateStringArray(mainData:IUserPreset[]){
  //   const newDates:string[]=[]
    
  //   mainData.forEach(data => {
  //     console.log("data ",data.date)
  //     newDates.push(data.date)
  //   });
  //   return newDates
  //  }
  //  @UseGuards(JwtAuthGuard)
  //  @Get('home/products/:index')
  //  async getSelectedItems(@Headers('User_ID') userID:string,@Param('index') index:number){
  //   console.log(this.messageGET,"\ntrying to get SelectedFood for:", (await this.userService.findOneUser(userID)).email,"index is ",index)
  //   const res=(await this.userService.findOneUserData(userID)).mainData[index].selectedFood
  //   if(!res)
  //     console.log("SelectedProducts not found res")
  //   else
  //     console.log("SelectedProducts found res", res)
  //   return res
  //  }
  //  @Post('home/product/post/:id')
  //  async saveCustomProduct(@Request() req,@Param('id') id: string,@Query('index') index:number) {
  //   const reqBody= req.body
  //   console.log(this.messagePOST,"\nWe gotten ", reqBody," id ",id," index ",index)
  //   var dateIndex=getDateIndex()

  //   const res= await this.userService.pushCustomProduct(id,dateIndex,reqBody,index)
  //   console.log("found", res)
  //   return res
  //  }
  //  @Delete('home/product/delete/:id')
  //  async deleteCustomProduct(
  //   @Param('id') id: string,@Query('idproduct') idProduct: string,@Query('index') index: number) {
  //   console.log(this.messageDELETE, "\nWe gotten id: ", id," idProduct: ",idProduct," index:",index)
  //   const res= await this.userService.deleteCustomProduct(id, idProduct, index)
  //   console.log("deleteCustomProduct() function result: ", res)
  //   return res
  //  }
  //  @Put('home/product/put/:id')
  //  async updateCustomSelectedProducts(
  //   @Request() req,@Param('id') id: string,@Query('index') index: number){
  //     const reqBody= req.body
  //     console.log(this.messagePUT,"\nWe gotten req.body: ", reqBody ,"We gotten index: ", index)
  //     const res= await this.userService.updateCustomProducts(reqBody,id,index)
  //     console.log("deleteCustomProduct() function result: ", res)
  //     return res
  //   }
   @UseGuards(JwtAuthGuard)
   @Get('validate')
   isValid(@Request() req) {
    //@UseGuards(JwtAuthGuard) should except the error
    console.log(this.messageGET+"\nlooks like the jwt is valid")
    return {isValid: true}
   }

  

}
