from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth_routes
app = FastAPI()

app.include_router(auth_routes.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://styler-op.vercel.app/"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/")
def health():
    return {"status": "healthy"}