export interface EmployeeLeaveSummaryAttributes {
  id?: number;
  employee_id: number;
  year: number;
  month: number;
  total_allowed_days: number;
  days_taken: number;
  remaining_days?: number;
  created_at: Date;
  updated_at: Date;
}

export interface EmployeeLeaveSummaryCreationAttributes
  extends Omit<EmployeeLeaveSummaryAttributes, "id" | "created_at" | "updated_at"> {}
