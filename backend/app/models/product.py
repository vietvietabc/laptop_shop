from sqlalchemy import Column, Integer, String, Float, Text
from ..database import Base

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    price = Column(Float)
    description = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)
    factory = Column(String(100), nullable=True) # Hãng sx