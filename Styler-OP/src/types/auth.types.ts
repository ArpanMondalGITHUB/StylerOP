export interface User{
    _id:string;
    username:string;
    email:string;
}

export interface UserSignup{
    username:string;
    email:string;
    password:string;
}

export interface UserLogin{
    email:string;
    password:string;
}

export interface LoginResponse{
    message:string;
    user:User;
}

export interface AuthState{
    user:User | null;
    isAuthenticated:boolean;
    authChecked: boolean,
    isLoading:boolean;
    error:string | null
}