export type TLeaveType = "late" | "unpaid_leave" | "other";


export interface SalaryDeductionsAttributes {
  id?: number;
  employee_id: number;
  date: Date;
  leave_type: TLeaveType;
  amount: number;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface SalaryDeductionCreationAttributes
  extends Omit<
    SalaryDeductionsAttributes,
    "id" | "created_at" | "updated_at"
  > {}

