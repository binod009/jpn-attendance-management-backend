export interface UserAttributes {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "Manager" | "Employee";
  created_at?: Date;
  updated_at?: Date;
}

export interface UserCreationAttributes
  extends Omit<UserAttributes, "id" | "created_at" | "updated_at"> {}
