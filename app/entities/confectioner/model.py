from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from app.repositories.database import Base


class Confectioner(Base):
    __tablename__ = "confectioners"

    confectioner_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    qualification_id = Column(Integer, ForeignKey("qualifications.qualification_id"))
    is_active = Column(Boolean)