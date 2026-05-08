export interface UserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserResponse {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  authToken?: string;
}

export interface UserResponseData {
  tableData: UserResponse;
  createdAt?: Date;
  updatedAt?: Date;
  job_search?: any[];
}

export interface UserLogin {
  email: string;
  password: string;
  userId?: number;
  iat?: number;
  exp?: number;
  auth_token?: string | null;
  gmailEmail?: string | null;
  gmailConsent?: boolean | null;
}

export interface AuthorizedUser {
  userId: number;
  email: string;
  iat?: number;
  exp?: number;
}

export interface UserDataRequest {
  userId: number;
  email: string;
}

export interface IUserData {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export type UserToken = { auth_token: string }
export type AuthUserResponse = Pick<UserResponse, 'email'>
export type UserPayload = Pick<UserDataRequest, 'email' | 'userId'>;
