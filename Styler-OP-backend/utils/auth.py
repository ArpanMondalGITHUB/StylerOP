import os
from fastapi import Response , HTTPException , status
from passlib.context import CryptContext
from fastapi.security import HTTPBearer
from typing import Optional
from datetime import datetime, timedelta
from jose import jwt , JWTError
import hashlib
from dotenv import load_dotenv
import os
load_dotenv()
IS_PRODUCTION = os.getenv("ENVIRONMENT") == "production"


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))


password_context = CryptContext(schemes=["argon2"], deprecated="auto")
security = HTTPBearer()


def get_password_hash(password: str) -> str:
    return password_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_context.verify(plain_password, hashed_password)

def create_access_token(user_data:dict,expires_delta:Optional[timedelta]=None):
 to_encode = user_data.copy()
 if expires_delta:
   expire = datetime.now() + expires_delta
 else:
   expire = datetime.now() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

 to_encode.update({
  "exp":expire,
  "type":"access"
  })
 
 encoded_jwt_token = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

 return encoded_jwt_token

def create_refresh_token(user_data:dict,expires_delta:Optional[timedelta]=None):
 to_encode = user_data.copy()
 if expires_delta:
   expire = datetime.now() + expires_delta
 else:
   expire = datetime.now() + timedelta(minutes=REFRESH_TOKEN_EXPIRE_DAYS)

 to_encode.update({
  "exp":expire,
  "type":"refresh"
  })
 
 encoded_jwt_token = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

 return encoded_jwt_token

def verify_access_token(token:str,token_type:str="access")->str:
 """Verify token and return email"""
 try:
   payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
   email:str = payload.get("sub")
   type_check:str = payload.get("type")

   if email is None or type_check != token_type:
     raise HTTPException(
       status_code=status.HTTP_401_UNAUTHORIZED,
       detail="Could not validate credentials"
      )
   
   return email
 except JWTError:
   raise HTTPException(
     status_code=status.HTTP_401_UNAUTHORIZED,
     detail="Could not validate credentials"
   )


def set_auth_cookie(response:Response,access_token:str,refresh_token:str):
  response.set_cookie(
    key="access_token",
    value=f"Bearer {access_token}",
    httponly=True,
    secure=IS_PRODUCTION,
    samesite="none",
    max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    path="/"
  )
  
  response.set_cookie(
    key="refresh_token",
    value=refresh_token,
    httponly=True,
    secure=IS_PRODUCTION,
    samesite="none",
    max_age=REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60,  # Days to seconds
    path="/"  # Only sent to refresh endpoint
  )

def set_access_token_cookie(response: Response, access_token: str):
    """Set only access token cookie (for refresh endpoint)"""
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=IS_PRODUCTION,
        samesite="none",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )