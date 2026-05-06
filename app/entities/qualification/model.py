from sqlalchemy import Column, Integer, String
from app.repositories.database import Base


class Qualification(Base):
    __tablename__ = "qualifications"

    qualification_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))