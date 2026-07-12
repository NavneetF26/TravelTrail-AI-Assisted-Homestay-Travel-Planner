from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr


class UpdateProfile(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)


class ChangePassword(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)