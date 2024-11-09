export interface UserRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

export interface UserResponse {
  id: number,
  name: string,
  email: string,
  password: string
}

export type UserLogin = Partial<Pick<UserRequest, 'email' | 'password'>>
