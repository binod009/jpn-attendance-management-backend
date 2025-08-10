
export interface PublicHolidaysAttributes{
    id?: number;
    date: Date,
    country?: string,
    region?:string,
    created_at: Date,
    updated_at:Date
}

export interface PublicHolidayCreationAttributes extends Omit<PublicHolidaysAttributes, "id" | "created_at" |"updated_at"> { }