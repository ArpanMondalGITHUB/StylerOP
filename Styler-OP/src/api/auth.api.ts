import type {LoginResponse, User, UserLogin, UserSignup } from "../type/auth.types";
import axiosInstance from "./axios.config";

const authApi = {
    signup: async (data:UserSignup): Promise<User>=> {
        const response = await axiosInstance.post<User>('auth/v1/signup',data,{
            withCredentials:true
        })
        return response.data;
    },

    login: async (data:UserLogin):Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>('auth/v1/login',data,{
            withCredentials:true
        })
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await axiosInstance.get<User>('auth/v1/me',{
            withCredentials:true
        })
        return response.data;
    },

    refreshToken: async (): Promise<void>=> {
        await axiosInstance.post('auth/v1/refresh',{},{withCredentials:true})
    },

    logout: async (): Promise<void> => {
        await axiosInstance.post('auth/v1/logout',{},{withCredentials:true})
    },

    logoutAll: async (): Promise<void> => {
        await axiosInstance.post('auth/v1/logout_all',{},{withCredentials:true})
    }

}

export default authApi;