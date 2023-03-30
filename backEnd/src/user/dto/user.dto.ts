import * as mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
    

})
export interface IUser {
    id?: string;
    username: string;
    password: string;
    email: string;
    //Date: Date;
}