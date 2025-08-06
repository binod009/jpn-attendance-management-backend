export interface TokenAttributes {
  id?: number;
    userId: number;
    token: string;
  is_archived?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface TokenCreationAttributes
  extends Omit<TokenAttributes, "id" | "created_at" | "updated_at"> {}
