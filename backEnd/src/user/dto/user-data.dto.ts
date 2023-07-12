import * as mongoose from 'mongoose';

const default_customFoods = [
  {
    name: "Test Default apple",
    kcal_total: 50,
    carbs: 30,
    protein: 10,
    fat: 10,
  },
  {
    name: "100 gram Chicken",
    kcal_total: 165,
    carbs: 0,
    protein: 31,
    fat: 3.6,
  },
  {
    name: "100 grams of Rice",
    kcal_total: 130,
    carbs: 28,
    protein: 2,
    fat: 0,
  },
  {
    name: "100 gram of Spaghetti",
    kcal_total: 130,
    carbs: 40,
    protein: 4.2,
    fat: 0.3,
  },
  {
    name: "100 gram of Bread",
    kcal_total: 266,
    carbs: 51,
    protein: 0,
    fat: 1.6,
  },
  {
    name: "100 gram of Beef",
    kcal_total: 250,
    carbs: 0,
    protein: 35,
    fat: 10,
  },
  {
    name: "100 gram of Egg",
    kcal_total: 131,
    carbs: 1.4,
    protein: 12.2,
    fat: 9,
  }
];

export const userDataSchema = new mongoose.Schema({
  referenceID: { type: String, required: true },
  //[type][food]
  customFood:{
    type: [[{
      name: {type: String,default:"Test Default apple"},
      kcal_total: {type: Number,default:50},
      carbs: {type: Number,default:30},
      protein: {type: Number,default:10},
      fat: {type: Number,default:10},
  }
]],
  required: true,
  default:[
    //TODO all the array
    default_customFoods,
    default_customFoods,
    default_customFoods,
    default_customFoods
  ]
  },
  mainData: { 
    type: [{
      date: { type: String,default: new Date().toLocaleDateString('en-GB', { year: '2-digit', month: '2-digit', day: '2-digit' })},
      kcal: {type: Number,default: 0},
      kcal_left: {type: Number,default: 2000},
      burned: {type: Number,default:0},
      carbs_total: {type: Number,default:300},
      carbs: {type: Number,default:0},
      protein_total: {type: Number, default:600},
      protein: {type: Number, default:0},
      fat_total: {type: Number, default:250},
      fat: {type: Number, default:0},
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

