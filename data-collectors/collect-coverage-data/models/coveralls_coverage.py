from pydantic import BaseModel
from bson import ObjectId

class CoverallsCoverage(BaseModel):
    _id: ObjectId
    repo_name: str
    branch: str
    url: str
    badge_url: str
    created_at: str
    commit_sha: str
    coverage_change: float
    covered_percent: float
    covered_lines: int
    missed_lines: int
    relevant_lines: int
    covered_branches: int
    missed_branches: int
    relevant_branches: int

    
    class Config:
        arbitrary_types_allowed = True
