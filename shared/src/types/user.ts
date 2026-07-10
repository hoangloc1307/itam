export interface UserBase<TDate = string> {
  username: string;
  name: string | null;
  email: string | null;
  isActive: boolean;
  deletedAt: TDate | null;
  createdBy: string;
  createdAt: TDate;
  updatedBy: string | null;
  updatedAt: TDate | null;
}

/** FE type — dates as ISO strings (after JSON serialization) */
export type User = UserBase<string>;

/** BE type — dates as Date objects (from Prisma) */
export type UserEntity = UserBase<Date>;
