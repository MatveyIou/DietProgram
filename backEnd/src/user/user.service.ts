import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {IUser } from './dto/user.dto';
import {ICustomFood, IUserData, IUserPreset} from './dto/user-data.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<IUser>,
    @InjectModel('Data') private readonly userDataModel: Model<IUserData>      ) {}

    //TODO CRUD for user
    async findAllUsers(): Promise<IUser[]> {
      return this.userModel.find().exec();
    }
    async findOneUser(id: string): Promise<IUser> {
      return this.userModel.findById(id).exec();
    }
    async findOneUserByEmail(email:string):Promise<IUser>{
      return await this.userModel.findOne({email}).exec()
    }
    async updateUser(id: string, userDto: IUser): Promise<IUser> {
      return this.userModel.findByIdAndUpdate(id, userDto, { new: true }).exec();
    }
    async deleteUser(id: string): Promise<IUser> {
      return await this.userModel.findByIdAndRemove(id);
    }
    async createUser(userDto: IUser) {
    const data =  new this.userModel({
      username: userDto.username,
      password: userDto.password,
      email: userDto.email,
    });
    const dataStat = new this.userDataModel({
      referenceID: data._id
    })
    await data.save()
    console.log("We saved User: \n", data)
    await dataStat.save() 
    console.log("We saved User Data: \n", dataStat)
    return {data, dataStat}
  }
  async findAllUsersData(): Promise<IUserData[]> {
    return this.userDataModel.find().exec();
  }
  
  async findOneUserData(referenceID: string): Promise<IUserData> {
    return await this.userDataModel.findOne({ referenceID }).exec();
  }
  
  async updateUserData(referenceID: string, userData: IUserData): Promise<IUserData> {
    return await this.userDataModel.findOneAndUpdate({ referenceID }, userData, { new: true }).exec();
  }
  
  async deleteUserData(referenceID: string): Promise<IUserData> {
    return await this.userDataModel.findOneAndRemove({ referenceID }).exec();
  }

  async findAllUserCustomFood(idUser: string):Promise<any>{
    const userCustomFood= await this.findOneUserData(idUser)
    return userCustomFood.customFood
  }

  async pushNewCustomFood(idUser: string, newCustomFood: ICustomFood, indexType: number): Promise<IUserData> {
    const userData = await this.findOneUserData(idUser)
    if (!userData) {
      throw new Error(`User with id ${idUser} not found`);
    }
    console.log(userData.customFood.length, indexType,"\n this is were we push ",userData.customFood[indexType])
    if(userData.customFood.length <= indexType){
      throw new Error(`type index ${indexType} is out of bounds`);
    }
    else
      userData.customFood[indexType].push(newCustomFood);
    const userUpdated = await userData.save();
    return userUpdated.toObject();
}
  async removeCustomFood(idUser: string,customProductID:string):Promise<IUserData>{
    const userUpdated= await this.findOneUserData(idUser)
    var flag= false;
    
    for (let i = 0; i < userUpdated.customFood.length; i++) {
      const foodType = userUpdated.customFood[i];
      const index = foodType.findIndex((food) => food._id.toString() === customProductID);
      if (index !== -1) {
        // Remove the found food item from the array
        foodType.splice(index, 1);
        flag = true;
        break; // Exit the loop when the index is found
      }
    }
    if(flag)
      console.log("we've deleted the custom product!")
    else
      console.log("we didn't find the custom product. doing nothing")
    return userUpdated.save()
  }
  async updateCustomFood(idUser: string,newData:ICustomFood):Promise<IUserData>{
    const userUpdated= await this.findOneUserData(idUser)
    var flag= false;

    for (let i = 0; i < userUpdated.customFood.length; i++) {
      const foodType = userUpdated.customFood[i];
      
      const index = foodType.findIndex((food) => food._id.toString() === newData._id);
      if (index !== -1) {
        console.log("FOUND "+foodType[index])
        // Replace the array value 
        foodType[index]=newData
        flag = true;
        break; // Exit the loop when the index is found
      }
    }
    if(flag)
      console.log("we've updated the custom product!")
    else
      console.log("we didn't find the custom product. doing nothing")
    return userUpdated.save()
  }

  async updateSelectedFood(userId: string,date:string, selectedFood: ICustomFood[][]): Promise<IUserData> {
    const userData = await this.findOneUserData(userId)
    userData.mainData[userData.mainData.findIndex(data => data.date === date)]
    .selectedFood=selectedFood

    return await userData.save()
  }
  //todo maybe redundant 
  async removeSelectedFood(userId: string,dateIndex: string,indexType:number,indexPos:number): Promise<IUserData> {
    const userData = await this.findOneUserData(userId)
    userData.mainData[dateIndex].selectedFood[indexType].splice(indexPos, 1);

    return await userData.save()
  }

  async addNextMainData(userId:string){
    const userData = await this.findOneUserData(userId)

    const lastMainData = userData.mainData[userData.mainData.length - 1];
    const nextDate = this.getNextDay(lastMainData.date);

    const newData ={
        date: nextDate,
        kcal: 0,
        kcal_left: 2000,
        burned: 0,
        carbs_total: 100,
        carbs: 0,
        protein_total: 100,
        protein: 0,
        fat_total: 100,
        fat: 0,
        selectedFood: [[],[],[],[]]
      }
    console.log("newData",newData)
    
  userData.mainData.push(newData);
  console.log("userData",userData.mainData)
  return await userData.save();
  }
  private getNextDay(date:string){
    const lastDateStats= date.split("/")//dd/mm/yy
    const nextDate= new Date("20"+lastDateStats[2]+"/"+lastDateStats[1]+"/"+lastDateStats[0])
    nextDate.setDate(nextDate.getDate()+1)
    return (nextDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }))
  }


}
