from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
from collections import Counter

from .db import SessionLocal, engine, Base
from . import models, schemas
from .ai import analyze_complaint


# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Complaint Triage Backend")

# Dev: allow all origins so localhost:3000/3001 can call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # in production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/health", response_model=schemas.HealthResponse)
def health_check():
    return schemas.HealthResponse(status="ok")


@app.post("/complaints", response_model=schemas.ComplaintOut)
def create_complaint(
    complaint: schemas.ComplaintCreate,
    db: Session = Depends(get_db),
):
    ai_result = analyze_complaint(complaint.text)

    db_complaint = models.Complaint(
        user_email=complaint.user_email,
        text=complaint.text,
        category=ai_result["category"],
        sentiment=ai_result["sentiment"],
        priority=ai_result["priority"],
        assigned_team=ai_result["assigned_team"],
        status="new",
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint


@app.get("/complaints", response_model=List[schemas.ComplaintOut])
def list_complaints(db: Session = Depends(get_db)):
    complaints = db.query(models.Complaint).order_by(models.Complaint.id.desc()).all()
    return complaints


@app.patch("/complaints/{complaint_id}/status", response_model=schemas.ComplaintOut)
def update_complaint_status(
    complaint_id: int,
    payload: schemas.ComplaintStatusUpdate,
    db: Session = Depends(get_db),
):
    complaint = (
        db.query(models.Complaint)
        .filter(models.Complaint.id == complaint_id)
        .first()
    )
    if complaint is None:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = payload.status
    db.commit()
    db.refresh(complaint)
    return complaint


@app.get("/stats/summary", response_model=schemas.StatsSummary)
def get_stats_summary(db: Session = Depends(get_db)):
    complaints = db.query(models.Complaint).all()
    total = len(complaints)

    by_category = Counter((c.category or "Uncategorized") for c in complaints)
    by_priority = Counter((c.priority or "Unknown") for c in complaints)
    by_sentiment = Counter((c.sentiment or "Unknown") for c in complaints)

    return schemas.StatsSummary(
        total_complaints=total,
        by_category=dict(by_category),
        by_priority=dict(by_priority),
        by_sentiment=dict(by_sentiment),
    )
