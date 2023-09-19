from data_collectors.models import Repository
from data_collectors.wrappers import *
import requests
import logging
import time
from ..config import settings

# Save logs
LOGGER = logging.getLogger('logger')
STREAM_HANDLER = logging.StreamHandler()
STREAM_HANDLER.setLevel(logging.INFO)
LOG_FORMATTER = logging.Formatter('%(asctime)s:%(levelname)s:%(message)s')
STREAM_HANDLER.setFormatter(LOG_FORMATTER)
LOGGER.addHandler(STREAM_HANDLER)
LOGGER.setLevel(logging.INFO)

# logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
# FILE_HANDLER = logging.FileHandler('pull_requests_collector.log')
# FILE_HANDLER.setFormatter(FILE_HANDLER)
# LOGGER.addHandler(FILE_HANDLER)

# GitHub access token
github_access_token = settings.GITHUB_ACCESS_TOKEN

# Define GraphQL query
graphql_query = '''
{
  repository(name: "%s", owner: "%s") {
    pullRequests(first: %s, orderBy: {field: CREATED_AT, direction: DESC}%s) {
      totalCount
      nodes {
        id
        merged
        participants(first: %s) {
          totalCount
          nodes {
            login
            id
            name
          }
        }
        createdAt
        mergedAt
        comments {
          totalCount
        }
        changedFiles
        additions
        checksUrl
        closed
        closedAt
        deletions
        number
        state
        url
        assignees {
          totalCount
        }
        author {
          ... on Bot {
            login
            id
          }
          ... on User {
            email
            login
            id
            name
          }
        }
        commits(first: %s) {
          totalCount
          nodes {
            commit {
              id
              message
              url
              treeUrl
              author {
                user {
                  email
                  login
                  name
                  id
                }
              }
            }
            url
          }
        }
        permalink
        reviews(first: %s) {
          totalCount
          nodes {
            author {
              ... on Bot {
                id
                login
              }
              ... on User {
                id
                email
                login
                name
              }
            }
          }
        }
        reviewRequests(first: %s) {
          totalCount
          nodes {
            requestedReviewer {
              ... on Bot {
                id
                login
              }
              ... on User {
                email
                login
                id
                name
              }
            }
          }
        }
        reviewThreads(first: %s) {
          totalCount
          nodes {
            comments {
              totalCount
            }
          }
        }
        mergedBy {
          ... on Bot {
            id
            login
          }
          ... on User {
            login
            id
            name
          }
        }
        title
        totalCommentsCount
        updatedAt
        reviewDecision
      }
      pageInfo {
        hasNextPage
        startCursor
        endCursor
        hasPreviousPage
      }
    }
    url
  }
}
'''

# Function to fetch and store pull requests
def fetch_and_store_pull_requests(repo_name, owner, default_req_size1 = 100, req_size2 = 100, end_cursor = None, index = 0, reduce_size = 30):
    req_size1 = default_req_size1
    while True:
        LOGGER.info(f"Index: {index}")
        after_param_str = f', after: "{end_cursor}"' if end_cursor else ''
        LOGGER.info(f"Making request for {owner}/{repo_name} with after param: {after_param_str} and $first: {req_size1}")
        
        query = graphql_query % (repo_name, owner, req_size1, after_param_str, 
                                 req_size2, req_size2, req_size2, req_size2, req_size2)
        
        response = requests.post(
            'https://api.github.com/graphql',
            json={'query': query},
            headers={'Authorization': f"bearer {github_access_token}"}
        )

        data = response.json()
        if 'errors' in data:
            LOGGER.error(f"Error for repository {repo_name} owned by {owner}: {data['errors']}")
            req_size1 -= reduce_size
            if req_size1 <= 0:
                LOGGER.info(f"Reached minimum req_size1, exiting.")
                break
            LOGGER.info(f"Changed req_size1 to = {req_size1}")
            
        elif 'documentation_url' in data and 'Retry-After' in response.headers:
            LOGGER.error(f"Reached limit, retry after {response.headers['Retry-After']} seconds.")
            time.sleep(int(response.headers['Retry-After']))
        else:
            req_size1 = default_req_size1
            
            repository_data = data['data']['repository']
            pull_requests = repository_data['pullRequests']
            LOGGER.info(f"Total records: {repository_data['pullRequests']['totalCount']}")
            nodes = pull_requests['nodes']

            for node in nodes:
              node['repository'] = f'{owner}/{repo_name}'

            LOGGER.info(f"Saving {len(nodes)} for {owner}/{repo_name}")
            PullRequestWrapper.save_many(nodes)
            index += len(nodes)
            
            # Check if there are more pages
            if not pull_requests['pageInfo']['hasNextPage']:
              LOGGER.info(f"Has next page: {pull_requests['pageInfo']['hasNextPage']}")
              break
            LOGGER.info(f"Has next page: {pull_requests['pageInfo']['hasNextPage']}")
            
            end_cursor = pull_requests['pageInfo']['endCursor']
            
    if (index + len(nodes)) < repository_data['pullRequests']['totalCount']:
        LOGGER.error(f"Check {repo_handle} records. Haven't reached the total count.")
    else:
        LOGGER.info(f"=== DONE FETCHING {repo_handle} RECORDS. ===")

repositories = RepositoryWrapper.read()

skip_list = []

# Loop through repositories and fetch pull requests
for repo in repositories:
    repo_handle = repo.name
    
    if repo_handle in skip_list:
        LOGGER.info(f"=== SKIP {repo_handle} ===")
        continue
    repo_name = repo_handle.split('/')[1]
    owner = repo_handle.split('/')[0]

    if repo_handle == "":
        fetch_and_store_pull_requests(repo_name=repo_name, owner=owner, default_req_size1=50, 
                                      end_cursor= "", index=0, reduce_size=5)
    else:
        LOGGER.info(f"=== Start fetching pull requests for: {repo_handle} ===")
        fetch_and_store_pull_requests(repo_name=repo_name, owner=owner, default_req_size1=50, reduce_size=5)
