"""DATABASE
MongoDB database initialization
"""
# # Installed # #
from pymongo.mongo_client import MongoClient
from pymongo.collection import Collection

# # Package # #
from scripts.config import settings

__all__ = ("client", "RepositoryCollection", "ProjectCollection")

client = MongoClient(settings.DATABASE_URL)
db = client[settings.MONGO_INITDB_DATABASE]
collist = db.list_collection_names()

if 'repository' not in collist:
    Repository = db["repository"]
else:
    Repository = db.repository

RepositoryCollection: Collection = db.repository
ProjectCollection: Collection = db.projects
