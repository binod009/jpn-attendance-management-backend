export interface AttendanceAttributes {
    id?: number;
    employee_id: number;
    status: "present" | "absent",
    date: Date,
    time_in?: Date,
    time_out?: Date,
    created_at?: Date,
    updated_at?:Date,
}

export interface AttendanceCreationAttributes extends Omit<AttendanceAttributes, "id" | "created_at" | "updated_at"> { }