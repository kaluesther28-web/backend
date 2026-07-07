export type UserRolesEnum = ("user" | "provider" | "admin")[];

export interface IUser {
  firstName:   string;
  lastName:    string;
  email:       string;
  phoneNumber: string;
  password:    string | undefined;
  isActive:    boolean;
  isVerified:  boolean;
  roles:       UserRolesEnum;
  createdAt:   Date;
  updatedAt:   Date;
}

export interface AuthenticatedUser {
  userId: string;
  roles:  UserRolesEnum;
  email?: string;
}