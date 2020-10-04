import BaseModel from './BaseModel'
const bcrypt = require("bcrypt")
const authConfig = require("@config/auth")

class UserModel extends BaseModel {
    static tableName = "admin_groups"

    //fields
    id: number;
    name: string;
    description: any;
    
}

export default UserModel