
export interface userData{
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