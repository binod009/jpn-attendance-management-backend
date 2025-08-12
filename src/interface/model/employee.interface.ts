export interface EmployeeAttributes {
  id?: number;
  user_id: number;         // Primary Key
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  position?: string;
  post_name: string;           // Job title / designation
  basic_salary: number;        // Base salary without overtime or deductions
  joining_date: Date;
  department?: string;
  created_at?: Date;
  updated_at?: Date;
}
export interface EmployeeCreationAttributes extends Omit<EmployeeAttributes, "id" | "created_at" | "updated_at"> { }