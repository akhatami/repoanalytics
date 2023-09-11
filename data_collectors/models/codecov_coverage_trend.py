from pydantic import BaseModel
from bson import ObjectId


class CodecovCoverageTrend(BaseModel):
    _id: ObjectId
    timestamp: str
    min: float
    max: float
    avg: float
    repo_name: str

    class Config:
        arbitrary_types_allowed = True
