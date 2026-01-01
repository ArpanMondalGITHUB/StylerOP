import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/authHooks"
import { refreshToken } from "../redux/slice/authSlice";
import { logger } from "../utils/loggers";

export const RefreshTokens = () => {
    const dispatch = useAppDispatch()
    const isAuthenticated = useAppSelector((state)=>state.auth.isAuthenticated);

    useEffect(() => {
        if (!isAuthenticated) return

        const interval = setInterval(() => {
            logger.log('🔄 Auto-refreshing token...');
            dispatch(refreshToken());
        }, 14 * 60 * 1000);
        return ()=> clearInterval(interval);
    }, [isAuthenticated,dispatch])
    
  return null;
};


