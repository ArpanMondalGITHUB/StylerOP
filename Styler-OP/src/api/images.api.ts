import type { StyleType, TransformImageResponse } from "../types/images.types";
import axiosInstance from "./axios.config";

const imageApi = {
    transformImage:async (file:File , style:StyleType): Promise<TransformImageResponse> =>{
        const formData = new FormData();
        formData.append("file",file);
        formData.append("style",style);
        const response = await axiosInstance.post(
            '/images/v1/transform-images',
            formData,
            {
                headers:{
                    "Content-Type": "multipart/form-data",
                },
                withCredentials:true
            }
        )
        return response.data;
    }
}

export default imageApi;