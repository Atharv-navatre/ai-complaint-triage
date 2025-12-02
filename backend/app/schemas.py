from datetime import datetime
from typing import Optional, Dict
from pydantic import BaseModel, EmailStr


class ComplaintCreate(BaseModel):
    text: str
    user_email: Optional[EmailStr] = None


class ComplaintOut(BaseModel):
    id: int
    user_email: Optional[EmailStr] = None
    text: str
    category: Optional[str] = None
    sentiment: Optional[str] = None
    priority: Optional[str] = None
    assigned_team: Optional[str] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True  # replaces orm_mode = True


class HealthResponse(BaseModel):
    status: str


class StatsSummary(BaseModel):
    total_complaints: int
    by_category: Dict[str, int]
    by_priority: Dict[str, int]
    by_sentiment: Dict[str, int]


class ComplaintStatusUpdate(BaseModel):
    status: str
