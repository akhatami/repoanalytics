"""WRAPPERS
Methods to interact with the database
"""
from bson import ObjectId
from typing import List, Dict, Union, Tuple

# # Package # #
from .models.repository import Repository
from .models.codecov_coverage_trend import CodecovCoverageTrend
from .models.coveralls_coverage import CoverallsCoverage
from .database import *
from ..utils import get_time, get_uuid

__all__ = ("RepositoryWrapper", "ProjectWrapper", "CodecovCoverageTrendWrapper", "CoverallsCoverageWrapper")


class RepositoryWrapper:
    @staticmethod
    def get_by_id(repository_id: str) -> Repository:
        """Retrieve a single Repository by its unique id"""
        document = None
        if repository_id is not None:
            document = RepositoryCollection.find_one({"_id": ObjectId(repository_id)})
        if not document:
            # raise RepositoryNotFoundException(repository_id)
            print(f"RepositoryNotFoundException({repository_id})")
        return document
    
    @staticmethod
    def read_by_name(name: str) -> Repository:
        document = RepositoryCollection.find_one({"name": name})
        if document:
            return Repository(**document)
        return None
    
    @staticmethod
    def read_by_id(self, document_id: ObjectId) -> Repository:
        document = RepositoryCollection.find_one({"_id": document_id})
        if document:
            return Repository(**document)
        return None
    
    @staticmethod
    def list_all() -> List[Repository]:
        """Retrieve all the available repositories"""
        cursor = RepositoryCollection.find()
        return [Repository(**document) for document in cursor]
    
    @staticmethod
    def read(query: Dict[str, Union[str, int]] = None) -> List[Repository]:
        """Retrieve by query"""
        if query is None:
            query = {}
        documents = RepositoryCollection.find(query)
        return [Repository(**doc) for doc in documents]
    
    @staticmethod
    def create_or_update(data: Repository) -> Tuple[str, int]:
        existing_record = RepositoryCollection.find_one({"name": data.name})
        if existing_record:
            data_dict = data.model_dump()
            # del data_dict["_id"]
            del data_dict["created_at"]
            result = RepositoryCollection.update_one({"name": data.name}, {"$set": data_dict})
            return "Updated", result.modified_count
        else:
            inserted_id = RepositoryCollection.insert_one(data.model_dump()).inserted_id
            return "Inserted", inserted_id

    @staticmethod
    def delete(self, document_id: ObjectId) -> int:
        result = RepositoryCollection.delete_one({"_id": document_id})
        return result.deleted_count
    
    @staticmethod
    def delete_by_name(self, name: str) -> int:
        result = RepositoryCollection.delete_one({"name": name})
        return result.deleted_count


class ProjectWrapper:
    """A Wrapper to do db operations on projects colloction"""
    @staticmethod
    def get(name: str):
        """Retrieve a single Project records by its name"""
        document = ProjectCollection.find_one({"name": name})
        if not document:
            # raise RepositoryNotFoundException(name)
            print(f"raise RepositoryNotFoundException({name})")
        return document

    @staticmethod
    def list():
        """Retrieve all the available Projects"""
        cursor = ProjectCollection.find()
        return [document for document in cursor]

class CodecovCoverageTrendWrapper:
    
    @staticmethod
    def save_many(data):
        """Save json"""
        CodecovCoverageCollection.insert_many(data)
    
    @staticmethod
    def list() -> List[CodecovCoverageTrend]:
        """Retrieve all the available records"""
        cursor = CodecovCoverageCollection.find()
        return [CodecovCoverageTrend(**document) for document in cursor]

class CoverallsCoverageWrapper:
    
    @staticmethod
    def save_many(data):
        """Save json"""
        CoverallsCoverageCollection.insert_many(data)
    
    @staticmethod
    def distinct_repos() -> List[str]:
        """Retrieve distinct repos"""
        return CoverallsCoverageCollection.distinct('repo_name')
        
    @staticmethod
    def list() -> List[CoverallsCoverage]:
        """Retrieve all the available records"""
        cursor = CoverallsCoverageCollection.find()
        return [CoverallsCoverage(**document) for document in cursor]
    