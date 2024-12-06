export interface UserRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface UserResponse {
  userId: number;
  firstname: string;
  lastname: string;
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
  iat?: number;
  exp?: number;
  auth_token?: string | null;
}

export type UserToken = { auth_token: string }
export type AuthUserResponse = Pick<UserResponse, 'email' | 'password'>
