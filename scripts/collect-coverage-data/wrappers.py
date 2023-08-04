"""WRAPPERS
Methods to interact with the database
"""

# # Package # #
from .models.repository import Repository
from .database import RepositoryCollection, ProjectCollection
from ..utils import get_time, get_uuid

__all__ = ("RepositoryWrapper", "ProjectWrapper")


class RepositoryWrapper:
    @staticmethod
    def get(repository_id: str = None, name: str = None) -> Repository:
        """Retrieve a single Repository by its unique id"""
        document = None
        if repository_id is not None:
            document = RepositoryCollection.find_one({"_id": repository_id})
        else:
            document = RepositoryCollection.find_one({"name": name})
        if not document:
            # raise RepositoryNotFoundException(repository_id)
            print(f"RepositoryNotFoundException({repository_id})")
        return document

    @staticmethod
    def list() -> [Repository]:
        """Retrieve all the available repositories"""
        cursor = RepositoryCollection.find()
        return [document for document in cursor]

    @staticmethod
    def create(document: Repository) -> Repository:
        """Create a repository and return its Read object"""
        if RepositoryWrapper.get(name=document.name) is None:
            result = RepositoryCollection.insert_one(document.model_dump())
            id = result._id
        else:
            RepositoryWrapper.update(document._id, document)
            id = document._id
        return RepositoryWrapper.get(id)

    @staticmethod
    def update(repository_id: str, update: Repository):
        """Update a repository by giving only the fields to update"""
        document = update.model_dump()
        document["updated"] = get_time()

        result = RepositoryCollection.update_one(
            {"_id": repository_id}, {"$set": document})

        if not result.modified_count:
            # raise RepositoryNotFoundException(identifier=repository_id)
            print(f"RepositoryNotFoundException(identifier={repository_id})")

    @staticmethod
    def delete(repository_id: str = None, name: str = None):
        """Delete a repository given its unique id or name"""
        if repository_id is None:
            result = RepositoryCollection.delete_one({"name": name})
        else:
            result = RepositoryCollection.delete_one({"_id": repository_id})

        if not result.deleted_count:
            # raise RepositoryNotFoundException(identifier=repository_id)
            print(
                f"raise RepositoryNotFoundException(identifier={repository_id})")


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
