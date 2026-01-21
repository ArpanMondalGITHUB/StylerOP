import {configureStore} from '@reduxjs/toolkit'
import authReducer from './slice/authSlice'
import imageReducer from './slice/imageSlice'
export const store = configureStore({
    reducer:{
        auth:authReducer,
        image:imageReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
