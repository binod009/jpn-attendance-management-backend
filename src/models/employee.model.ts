import { DataTypes, Model, Sequelize } from "sequelize";
import {
  EmployeeAttributes,
  EmployeeCreationAttributes,
} from "../interface/model/employee.interface";
const EmployeeModel = (sequelize: Sequelize) => {
  class Employee
    extends Model<EmployeeAttributes, EmployeeCreationAttributes>
    implements EmployeeAttributes
  {
    public id?: number;
    public user_id!: number;
    public first_name!: string;
    public last_name!: string;
    public email!: string;
    public phone?: string;
    public post_name!: string;
      public basic_salary!: number;
      public position?: string;
    public joining_date!: Date;
    public department?: string;
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
  }
  Employee.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      user_id: {
        type: DataTypes.INTEGER,
        references: { model: "users", key: "id" },
      },
      first_name: { type: DataTypes.STRING, allowNull: false },
      last_name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: false, unique: true },
      phone: { type: DataTypes.STRING },
      post_name: { type: DataTypes.STRING, allowNull: false },
          basic_salary: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      position:{type:DataTypes.STRING,allowNull:true},
      joining_date: { type: DataTypes.DATE, allowNull: false },
      department: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "Employee",
      tableName: "employees",
      timestamps: true,
    }
  );
  return Employee;
};
export default EmployeeModel;
