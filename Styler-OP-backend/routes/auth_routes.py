from datetime import datetime, timedelta
from fastapi import Request, Response, status, HTTPException , APIRouter
from models.user import UserCreate, UserLogin,UserResponse
from db.mongo import db , users_collection , refresh_tokens_collection
from utils.auth import ACCESS_TOKEN_EXPIRE_MINUTES, IS_PRODUCTION, REFRESH_TOKEN_EXPIRE_DAYS, create_access_token, create_refresh_token, get_password_hash, set_access_token_cookie, set_auth_cookie, verify_access_token, verify_password
router = APIRouter(prefix="/auth/v1", tags=["Authentication"])

@router.post("/signup", response_model=UserResponse)
def signup(user: UserCreate, response: Response):
    """signup the user """

    existing = users_collection.find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user.password)

    user_dict = {
        "username": user.username,
        "email": user.email,
        "password": hashed_password
    }

    result = users_collection.insert_one(user_dict)

    access_token = create_access_token(user_data={"sub": user.email})
    refresh_token = create_refresh_token({"sub": user.email})

    refresh_tokens_collection.insert_one(
       {
        "user_id": str(result.inserted_id),
        "token": refresh_token,
        "created_at": datetime.now(),
        "expires_at": datetime.now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
       }
    )

    set_auth_cookie(response, access_token, refresh_token)

    return {
       "_id": str(result.inserted_id),
       "username": user.username,
       "email": user.email
      }


@router.post('/login')
def login(user:UserLogin,response:Response):
   """Login user"""

   db_user = users_collection.find_one({"email": user.email})

   if not db_user or not verify_password(user.password,db_user["password"]):
      raise HTTPException(
         status_code=status.HTTP_401_UNAUTHORIZED,
         detail="Incorrect Email or Password"
      )
   
   access_token = create_access_token(user_data={"sub": user.email})
   refresh_token = create_refresh_token(user_data={"sub": user.email})

   refresh_tokens_collection.insert_one(
      {
       "user_id": str(db_user["_id"]),
       "token": refresh_token,
       "created_at": datetime.now(),
       "expires_at": datetime.now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
      }
   )

   set_auth_cookie(response,access_token,refresh_token)

   return{
      "message": "Login successful",
      "user":
       {
        "_id":str(db_user["_id"]),
        "username": db_user["username"],
        "emai":db_user["email"],
        }
   }

@router.post('/refresh')
def refresh_access_token(request: Request, response: Response):
    """
    Get new access token using refresh token.
    
    Security improvements:
    1. Validates refresh token exists
    2. Verifies token signature and expiration
    3. Checks token hasn't been revoked
    4. Optional: Implements token rotation
    """
    # Step 1: Get refresh token from cookie
    refresh_token = request.cookies.get("refresh_token")
    
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token not found"
        )
    
    # Step 2: Verify token signature and decode
    # verify_token() already raises HTTPException if invalid
    # No need for try-except here
    email = verify_access_token(refresh_token, token_type="refresh")
    
    # Step 3: Additional validation (defensive programming)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Step 4: Check if refresh token exists in database (not revoked)
    stored_token = refresh_tokens_collection.find_one({"token": refresh_token})
    
    if not stored_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked"
         )
    
    # Step 5: Optional - Check if token is close to expiration
    # If yes, issue new refresh token too (token rotation)
    time_until_expiry = stored_token["expires_at"] - datetime.now()
    should_rotate = time_until_expiry.total_seconds() < (24 * 60 * 60)  # Less than 1 day
    
    # Step 6: Create new access token
    new_access_token = create_access_token(user_data={"sub": email})
    
    if should_rotate:
        # Token rotation: Issue new refresh token
        new_refresh_token = create_refresh_token(user_data={"sub": email})
        
        # Delete old refresh token
        refresh_tokens_collection.delete_one({"token": refresh_token})
        
        # Store new refresh token
        user = users_collection.find_one({"email": email})
        refresh_tokens_collection.insert_one({
            "user_id": str(user["_id"]),
            "token": new_refresh_token,
            "created_at": datetime.now(),
            "expires_at": datetime.now() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        })
        
        # Set both tokens
        set_auth_cookie(response, new_access_token, new_refresh_token)
    else:
        # Only update access token
        set_access_token_cookie(response, new_access_token)
    
    return {"message": "Access token refreshed"}


@router.get('/me',response_model=UserResponse)
def get_current_user(request:Request,response:Response):
    """Get current user information"""

    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authorized"
        )
    
    token = token.replace("Bearer ", "")

    email = verify_access_token(token,token_type="access")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    user = users_collection.find_one({"email":email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserResponse(
        _id=str(user["_id"]),
        username=user["username"],
        email=user["email"]
    )

@router.post('/logout')
def logout(request:Request,response:Response):
   """Logout from the current device"""

   refresh_token = request.cookies.get("refresh_token")
   if refresh_token:
       refresh_tokens_collection.delete_one({"token":refresh_token})

   response.delete_cookie(key="access_token", path="/")
   response.delete_cookie(key="refresh_token", path="/refresh")

   return {"message": "Logged out successfully"}

@router.post('/logout_all')
def logout_all(request:Request,response:Response):
    """Logout from all devices (revoke all refresh tokens)"""
    
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not Authenticated"
        )
    
    token = token.replace("Bearer ", "")

    email = verify_access_token(token,token_type="access")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    user = users_collection.find_one({"email":email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    result = refresh_tokens_collection.delete_many({"user_id":str(user["_id"])})

    response.delete_cookie(key="access_token",path="/")
    response.delete_cookie(key="refresh_token",path="/refresh")

    return {
        "message": "Logged out from all devices",
        "tokens_revoked": result.deleted_count
    }

@router.get("/test-db")
async def test_db():
    collections = await db.list_collection_names()
    return {"status": "connected", "collections": collections}