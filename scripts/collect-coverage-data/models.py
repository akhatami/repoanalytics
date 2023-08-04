import uuid
from datetime import datetime
from pydantic import BaseModel, PositiveInt, Field
from typing import Optional

class Project(BaseModel):
    id: str = Field(default_factory=uuid.uuid4(), alias="_id")
    name: str
    language: str

class ProjectUpdate(BaseModel):
    title: Optional[str]
    author: Optional[str]
    synopsis: Optional[str]
