export interface LoginRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}


export interface UserRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface UserResponse {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  authToken?: string;
  job_search: any[]
}

export interface UserLogin {
  email: string,
  password: string,
  auth_token?: string | null
}

export type UserToken = { auth_token: string }
