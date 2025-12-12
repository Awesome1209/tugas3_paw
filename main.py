import os
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
import google.generativeai as genai

# --- 1. CONFIGURATION ---
# PENTING: GANTI DENGAN API KEY GEMINI KAMU JIKA PUNYA
GEMINI_API_KEY = "MASUKKAN_API_KEY_GEMINI_DISINI" 

# DATABASE CONFIG
# Menggunakan SQLite agar tidak perlu install PostgreSQL (Portable untuk demo)
DATABASE_URL = "sqlite:///./reviews.db" 

# --- 2. SETUP DATABASE ---
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class ReviewModel(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    sentiment = Column(String, nullable=True)
    key_points = Column(Text, nullable=True)

Base.metadata.create_all(bind=engine)

# --- 3. SETUP AI ---
print("Loading AI Models... (Mungkin butuh waktu saat pertama kali jalan)")

# GANTI MODEL KE MULTILINGUAL (Bisa Indo & Inggris)
# Model ini akan didownload otomatis saat pertama kali aplikasi dijalankan (~400MB)
sentiment_analyzer = pipeline("sentiment-analysis", model="lxyuan/distilbert-base-multilingual-cased-sentiments-student")

# Setup Gemini
if GEMINI_API_KEY != "MASUKKAN_API_KEY_GEMINI_DISINI":
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')

# --- 4. FASTAPI APP ---
app = FastAPI()

# Enable CORS agar React bisa akses
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Schemas
class ReviewInput(BaseModel):
    text: str

class ReviewResponse(BaseModel):
    id: int
    text: str
    sentiment: str
    key_points: str

# --- 5. ENDPOINTS ---

@app.post("/api/analyze-review")
def analyze_review(review: ReviewInput, db: Session = Depends(get_db)):
    try:
        # 1. Sentiment Analysis (Hugging Face)
        # Melakukan analisis teks
        hf_result = sentiment_analyzer(review.text)[0]
        raw_label = hf_result['label'].upper()
        
        # Mapping label agar konsisten (POSITIVE/NEGATIVE)
        # Model multilingual kadang memberikan output "positive", "5 stars", dsb.
        sentiment_label = "NEUTRAL"
        if "POS" in raw_label or "4" in raw_label or "5" in raw_label:
            sentiment_label = "POSITIVE"
        elif "NEG" in raw_label or "1" in raw_label or "2" in raw_label:
            sentiment_label = "NEGATIVE"
        else:
            sentiment_label = raw_label # Fallback

        # 2. Key Points Extraction (Gemini)
        key_points_text = "Gemini API Key missing or error."
        if GEMINI_API_KEY != "MASUKKAN_API_KEY_GEMINI_DISINI":
            try:
                # Prompt meminta output sesuai bahasa review
                prompt = f"Extract key points from this product review (keep the language same as review) using bullet points: {review.text}"
                response = model.generate_content(prompt)
                key_points_text = response.text
            except Exception as e:
                key_points_text = f"Gemini Error: {str(e)}"
        
        # 3. Save to DB
        db_review = ReviewModel(text=review.text, sentiment=sentiment_label, key_points=key_points_text)
        db.add(db_review)
        db.commit()
        db.refresh(db_review)
        
        return db_review
    except Exception as e:
        print(f"Error during analysis: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/reviews")
def get_reviews(db: Session = Depends(get_db)):
    return db.query(ReviewModel).all()