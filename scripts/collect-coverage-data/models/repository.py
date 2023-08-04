from pydantic import BaseModel

from ...utils import get_uuid, get_time

__all__ = ("Repository",)


class Repository(BaseModel):
    _id: str = get_uuid()
    name: str
    language: str
    default_branch: str
    has_codecov: int
    has_coveralls: int
    has_codeclimate: int
    created_at: int = get_time()
    updated_at: int = get_time()
