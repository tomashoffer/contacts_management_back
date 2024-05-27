// authInterfaces.ts

export interface RegisterResponse {
    token: string;
  }
  
  export interface LoginResponse {
    token: string;
    userData: {
      id: string;
      email: string;
      username: string;
    };
  }
  
  export interface UserInfoResponse {
    id: string;
    username: string;
    email: string;
    token: string;
  }
  