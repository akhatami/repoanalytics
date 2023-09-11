from pydantic import BaseModel
from bson import ObjectId

from data_collectors.utils import get_time


class Repository(BaseModel):
    _id: ObjectId
    name: str
    language: str
    default_branch: str
    has_codecov: int
    has_coveralls: int
    has_codeclimate: int
    created_at: int = get_time()
    updated_at: int = get_time()
