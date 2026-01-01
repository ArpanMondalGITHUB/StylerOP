from pydantic import BaseModel, EmailStr , Field
from typing import Optional


class UserCreate(BaseModel):
    username: str = Field(...,min_length=2,max_length=50)
    email: EmailStr
    password: str = Field(...,min_length=8)

class UserResponse(BaseModel):
    _id: str
    username: str
    email: EmailStr

class UserLogin(BaseModel):
    email:EmailStr
    password:str

class Token(BaseModel):
    access_token:str
    refresh_token:str
    token_type:str="bearer"

class TokenData(BaseModel):
    email: Optional[str] = None