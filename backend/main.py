from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = os.getenv("API_KEY")
MODEL = os.getenv("MODEL")

# Pydantic model for request body
class ChatRequest(BaseModel):
    prompt: str

# output_specification= "\n I want the output pointwise, so that I can directly display it in the frontend"
async def generate_response(prompt: str):
    print("User prompt:",prompt)

    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel(MODEL)
    response = model.generate_content(prompt)
    res= response.text
    print(res)
    
    return response.text

@app.get("/")
def home_route():
    return {"message": "Hello, World!"}

@app.post("/chat")
async def chat(request: ChatRequest):
    response = await generate_response(request.prompt)
    return {"response": response}
