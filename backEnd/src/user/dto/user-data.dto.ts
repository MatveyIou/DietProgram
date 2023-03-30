import * as mongoose from 'mongoose';

export const userDataSchema = new mongoose.Schema({
  referenceID: { type: String, required: true },
  //[type][food]
  customFood:{
    type: [[{
      name: {type: String,default:"default apple"},
      kcal_total: {type: Number,default:50},
      carbs: {type: Number,default:30},
      protein: {type: Number,default:10},
      fat: {type: Number,default:10},
  }]],
  required: true,
  default:[[{
    name: "default apple",
    kcal_total:50,
    carbs:30,
    protein:10}],[{}],[{}],[{}]]},
  mainData: { 
    type: [{
      date: { type: String,default: new Date().toLocaleDateString('en-GB', { year: '2-digit', month: '2-digit', day: '2-digit' })},
      kcal: { type: Number,default: 0},
      kcal_left: { type: Number,default: 2000},
      burned: { type: Number,default:0},
      carbs_total: { type: Number,default:100},
      carbs: { type: Number,default:0},
      protein_total: { type: Number, default:100},
      protein: { type: Number, default:0},
      fat_total: { type: Number, default:100},
      fat: { type: Number, default:0},
      selectedFood:{ type:[[]],default:[[],[],[],[]]}
    }],
    required: true,default:{}},
  
});


export interface IUserData extends mongoose.Document {
  referenceID: string;
  customFood: ICustomFood[][];
  mainData: IUserPreset[];
}
export interface ICustomFood {
  _id?: string
  referenceID?:string
  name: string;
  kcal_total: number;
  carbs: number;
  protein: number;
  fat: number;
}
export interface IUserPreset {
  date: string;
  kcal: number;
  kcal_left: number;
  burned: number;
  carbs_total: number;
  carbs: number;
  protein_total: number;
  protein: number;
  fat_total: number;
  fat: number;
  selectedFood: ICustomFood[][];
}

