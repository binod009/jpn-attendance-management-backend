export interface AttendanceAttributes {
    id?: number;
    employeeId: number;
    status: "present" | "absent",
    date: Date,
    timeIn: Date,
    timeOut: Date,
    created_at?: Date,
    updated_at?:Date,
}

export interface AttendanceCreationAttributes extends Omit<AttendanceAttributes, "id" | "created_at" | "updated_at"> { }