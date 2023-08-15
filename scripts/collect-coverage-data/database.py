"""DATABASE
MongoDB database initialization
"""
# # Installed # #
from pymongo.mongo_client import MongoClient
from pymongo import ASCENDING
from pymongo.collection import Collection

# # Package # #
from scripts.config import settings

__all__ = ("client", "RepositoryCollection", "ProjectCollection", "CodecovCoverageCollection", "CoverallsCoverageCollection")

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

if 'coveralls_coverage' not in collist:
    CoverallsCoverageCollection: Collection = db["coveralls_coverage"]
else:
    CoverallsCoverageCollection: Collection = db.coveralls_coverage
    

ProjectCollection: Collection = db.projects
RepositoryCollection.create_index([('name', ASCENDING)], unique=True)
