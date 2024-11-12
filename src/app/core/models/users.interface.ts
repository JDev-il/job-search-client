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
  job_search: any[]
}

export type UserLogin = Partial<Pick<UserRequest, 'email' | 'password'>>



// export class User {
//   @PrimaryGeneratedColumn()
//   user_id: number;

//   @Column({ name: 'first_name' })
//   first_name: string;

//   @Column({ name: 'last_name' })
//   last_name: string;

//   @Column()
//   email: string;

//   @Column()
//   password: string;

//   @Column({ name: 'created_at', type: 'timestamp' })
//   createdAt: Date;

//   @Column({ name: 'updated_at', type: 'timestamp' })
//   updatedAt: Date;
//   // One-to-Many relationship with JobSearch
//   @OneToMany(() => JobSearch, (jobSearch) => jobSearch.user)
//   jobSearhData: JobSearch[];
