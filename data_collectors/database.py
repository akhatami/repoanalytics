"""DATABASE
MongoDB database initialization
"""
# # Installed # #
from pymongo.mongo_client import MongoClient
from pymongo import ASCENDING
from pymongo.collection import Collection

# # Package # #
from data_collectors.config import settings

__all__ = ("client", "RepositoryCollection", "ProjectCollection", "CodecovCoverageCollection",
           "CoverallsCoverageCollection", "PullRequestCollection", "CommitStatusCheckCollection")

client = MongoClient(settings.DATABASE_URL)
db = client[settings.MONGO_INITDB_DATABASE]
collList = db.list_collection_names()

if 'repository' not in collList:
    RepositoryCollection: Collection = db["repository"]
else:
    RepositoryCollection: Collection = db.repository
    
if 'codecov_coverage_trend' not in collList:
    CodecovCoverageCollection: Collection = db["codecov_coverage_trend"]
else:
    CodecovCoverageCollection: Collection = db.codecov_coverage_trend

if 'coveralls_coverage' not in collList:
    CoverallsCoverageCollection: Collection = db["coveralls_coverage"]
else:
    CoverallsCoverageCollection: Collection = db.coveralls_coverage

if 'pull_request' not in collList:
    PullRequestCollection: Collection = db["pull_request"]
else:
    PullRequestCollection: Collection = db.pull_request

if 'commit_status_check' not in collList:
    CommitStatusCheckCollection: Collection = db["commit_status_check"]
else:
    CommitStatusCheckCollection: Collection = db.commit_status_check
    

ProjectCollection: Collection = db.projects
RepositoryCollection.create_index([('name', ASCENDING)], unique=True)
