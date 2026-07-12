import re
from fastapi import APIRouter, HTTPException, status, Depends, Request

from app.utils.rate_limiter import limiter

from app.database import (
    users_collection,
    bookings_collection,
    saved_homestays_collection,
)

from app.models.user import (
    UserCreate,
    UserLogin,
    UserResponse,
    UpdateProfile,
    ChangePassword,
)
from app.utils.auth import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

from fastapi.responses import RedirectResponse
from app.utils.oauth import oauth

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
)
@limiter.limit("5/15minutes")
def register(
    request: Request,
    user: UserCreate,
):

    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    last_user = users_collection.find_one(
        sort=[("id", -1)]
    )

    new_id = 1

    if last_user:
        new_id = last_user["id"] + 1

    password_pattern = (
        r"^(?=.*[a-z])"
        r"(?=.*[A-Z])"
        r"(?=.*\d)"
        r"(?=.*[@$!%*?&^#()_\-+=])"
        r"[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$"
    )
    if not re.match(password_pattern, user.password):
        raise HTTPException(
            status_code=400,
            detail=(
                "Password must contain at least 8 characters, "
                "one uppercase letter, one lowercase letter, "
                "one number and one special character."
            ),
        )

    hashed_password = hash_password(user.password)

    document = {
        "id": new_id,
        "name": user.name,
        "email": user.email,
        "password": hashed_password,
    }

    users_collection.insert_one(document)

    return UserResponse(
        id=new_id,
        name=user.name,
        email=user.email,
    )


@router.post("/login")
@limiter.limit("5/15minutes")
def login(
    request: Request,
    user: UserLogin,
):

    db_user = users_collection.find_one(
        {"email": user.email}
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    if not verify_password(
        user.password,
        db_user["password"],
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    token = create_access_token(
        {
            "id": db_user["id"],
            "email": db_user["email"],
            "name": db_user["name"],
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": UserResponse(
            id=db_user["id"],
            name=db_user["name"],
            email=db_user["email"],
        ),
    }

@router.get("/me",response_model=UserResponse,)
def get_me(
    current_user=Depends(get_current_user),
):
    return UserResponse(
        id=current_user["id"],
        name=current_user["name"],
        email=current_user["email"],
    )

@router.put("/profile")
def update_profile(
    profile: UpdateProfile,
    current_user=Depends(get_current_user),
):

    users_collection.update_one(
        {"id": current_user["id"]},
        {
            "$set": {
                "name": profile.name
            }
        },
    )

    updated_user = users_collection.find_one(
        {"id": current_user["id"]}
    )

    return {
        "message": "Profile updated successfully",
        "user": UserResponse(
            id=updated_user["id"],
            name=updated_user["name"],
            email=updated_user["email"],
        ),
    }


@router.put("/change-password")
def change_password(
    passwords: ChangePassword,
    current_user=Depends(get_current_user),
):

    db_user = users_collection.find_one(
        {"id": current_user["id"]}
    )

    if not db_user["password"]:
        raise HTTPException(
            status_code=400,
            detail="This account uses Google Sign-In and cannot change its password."
        )

    if not verify_password(
        passwords.current_password,
        db_user["password"],
    ):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect",
        )

    if passwords.current_password == passwords.new_password:
        raise HTTPException(
            status_code=400,
            detail="New password must be different from the current password",
        )

    password_pattern = (r"^(?=.*[a-z])"r"(?=.*[A-Z])"r"(?=.*\d)"r"(?=.*[@$!%*?&^#()_\-+=])"r"[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$")

    if not re.match(password_pattern, passwords.new_password):
        raise HTTPException(
            status_code=400,
            detail=(
                "Password must contain at least 8 characters, "
                "one uppercase letter, one lowercase letter, "
                "one number and one special character."
            ),
        )
        
    users_collection.update_one(
        {"id": current_user["id"]},
        {
            "$set": {
                "password": hash_password(
                    passwords.new_password
                )
            }
        },
    )

    return {
        "message": "Password updated successfully"
    }

@router.get("/google/login")
async def google_login(request: Request):

    redirect_uri = request.url_for("google_callback")

    return await oauth.google.authorize_redirect(
        request,
        redirect_uri,
    )

@router.get("/google/callback", name="google_callback")
async def google_callback(request: Request):

    token = await oauth.google.authorize_access_token(request)

    user_info = token["userinfo"]

    email = user_info["email"]
    name = user_info["name"]

    db_user = users_collection.find_one(
        {"email": email}
    )

    if not db_user:

        last_user = users_collection.find_one(
            sort=[("id", -1)]
        )

        new_id = 1

        if last_user:
            new_id = last_user["id"] + 1

        document = {
            "id": new_id,
            "name": name,
            "email": email,
            "password": "",
        }

        users_collection.insert_one(document)

        db_user = document

    jwt_token = create_access_token(
        {
            "id": db_user["id"],
            "email": db_user["email"],
            "name": db_user["name"],
        }
    )

    return RedirectResponse(
        url=(
            "http://localhost:5173/oauth-success"
            f"?token={jwt_token}"
        )
    )

@router.post("/logout")
def logout():
    return {
        "message": "Logged out successfully"
    }

@router.delete("/account")
def delete_account(
    current_user=Depends(get_current_user),
):
    user_id = current_user["id"]

    # Delete all bookings
    bookings_collection.delete_many(
        {
            "user_id": user_id
        }
    )

    # Delete all saved homestays
    saved_homestays_collection.delete_many(
        {
            "user_id": user_id
        }
    )

    # Delete user account
    result = users_collection.delete_one(
        {
            "id": user_id
        }
    )

    if result.deleted_count == 0:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return {
        "message": "Account deleted successfully"
    }