import re
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


async def generate_response(prompt: str):
    print("User prompt:", prompt)

    # Configure GenAI API
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel(MODEL)

    # Get AI response 
    response = model.generate_content(prompt)
    res = response.text
    print("Raw Response:", res)

    # Split response into points
    points = re.split(r'\.\s+', res.strip())
    points = [point.strip() for point in points if point.strip()]  # Clean up empty or extra spaces

    print("Processed Points:", points)
    return points


@app.get("/")
def home_route():
    return {"message": "Hello, World!"}


@app.post("/chat")
async def chat(request: ChatRequest):
    response_points = await generate_response(request.prompt)
    return {"response": response_points}
