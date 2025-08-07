import { Sequelize } from "sequelize";
import sequelize from "../../config/database";

export type TLeaveType = "sick" | "vacation" | "casual"; // You can extend this if needed

export type TLeaveStatus = "pending" | "approved" | "rejected";

export interface LeaveRequestAttributes {
  id?: number;
  employeeId: number;
  leave_type: TLeaveType;
  reason: string;
  start_date: string; // ISO date string like "2025-08-10"
  end_date: string; // ISO date string
  status?: TLeaveStatus; // optional during creation, defaults to 'pending'
  created_at?: string; // ISO datetime string
  updated_at?: string;
}

export interface LeaveRequestCreationAttributes
  extends Omit<LeaveRequestAttributes, "id" | "created_at" | "updated_at"> {}
