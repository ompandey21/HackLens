from fastapi import FastAPI
from app.routes import auth, users
from app.routes import model_evaluator
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(model_evaluator.router, prefix="/model_evaluator", tags=["Model Evaluator"])

@app.get("/")
async def root():
    return {"message": "Welcome to Hack Lens!"}