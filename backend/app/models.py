from sqlalchemy import Column, Integer, String, DateTime, Text
from datetime import datetime

from .db import Base


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, nullable=True)
    text = Column(Text, nullable=False)
    category = Column(String, nullable=True)
    sentiment = Column(String, nullable=True)
    priority = Column(String, nullable=True)
    assigned_team = Column(String, nullable=True)
    status = Column(String, nullable=False, default="new")
    created_at = Column(DateTime, default=datetime.utcnow)
