import { DataTypes, Model, Optional, Sequelize } from "sequelize"; // adjust path
import { UserCreationAttributes } from "../interface/model/user.interface";

// Define attributes for User
interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Manager" | "Employee";
  created_at?: Date;
  updated_at?: Date;
}
  
const userModel = (sequelize: Sequelize) => {

    class User
        extends Model<UserAttributes, UserCreationAttributes>
        implements UserAttributes {
        public id!: number;
        public name!: string;
        public email!: string;
        public password!: string;
        public role!: "Admin" | "Manager" | "Employee";
        public created_at?: Date;
        public updated_at?: Date;
    }

    User.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            email: {
                type: new DataTypes.STRING(128),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: new DataTypes.STRING(128),
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM("Admin", "Manager", "Employee"),
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                field: "created_at",
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
                field: "updated_at",
            },
        },
        {
            sequelize,
            tableName: "users",
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            hooks: {
                beforeCreate: (cart) => {
                    cart.created_at = new Date();
                    cart.updated_at = new Date();
                },
                beforeUpdate: (cart) => {
                    cart.updated_at = new Date();
                },
            },
     
     
    
        }
  

    );
    return User;
}



export default userModel;