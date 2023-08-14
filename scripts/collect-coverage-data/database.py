"""DATABASE
MongoDB database initialization
"""
# # Installed # #
from pymongo.mongo_client import MongoClient
from pymongo import ASCENDING
from pymongo.collection import Collection

# # Package # #
from scripts.config import settings

__all__ = ("client", "RepositoryCollection", "ProjectCollection", "CodecovCoverageCollection")

client = MongoClient(settings.DATABASE_URL)
db = client[settings.MONGO_INITDB_DATABASE]
collist = db.list_collection_names()

if 'repository' not in collist:
    RepositoryCollection: Collection = db["repository"]
else:
    RepositoryCollection: Collection = db.repository
    
if 'codecov_coverage_trend' not in collist:
    CodecovCoverageCollection: Collection = db["codecov_coverage_trend"]
else:
    CodecovCoverageCollection: Collection = db.codecov_coverage_trend

ProjectCollection: Collection = db.projects
RepositoryCollection.create_index([('name', ASCENDING)], unique=True)
