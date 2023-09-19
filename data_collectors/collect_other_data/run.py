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

# GitHub access token
github_access_token = settings.GITHUB_ACCESS_TOKEN

# Define GraphQL query
graphql_query = '''
{
  repository(name: "%s", owner: "%s") {
    id
    createdAt
    description
    forkCount
    homepageUrl
    name
    stargazerCount
    pushedAt
    updatedAt
    latestRelease {
      id
      url
      tagName
      name
      createdAt
    }
    watchers {
      totalCount
    }
    primaryLanguage {
      id
      color
      name
    }
    issueTemplates{
      about
      filename
      name
      title
    }
    licenseInfo {
      id
      name
    }
    issues {
      totalCount
    }
    pullRequestTemplates {
      filename
    }
    pullRequests {
      totalCount
    }
    codeOfConduct{
      id
      name
      key
      body
      url
    }
    contributingGuidelines{
      url
    }
    assignableUsers(first: 100){
      totalCount
      nodes {
        id
        login
        name
      }
    }
    labels(first: 100) {
      totalCount
      nodes {
        name
        id
        description
        color
        createdAt
      }
    }
    languages(first: 100) {
      totalCount
      nodes {
        name
        id
        color
      }
    }
  }
}
'''

# Function to fetch and store commits status checks
def fetch_and_store_repo_details(repo_name, owner):
    LOGGER.info(f"Making request for {owner}/{repo_name}")
    
    query = graphql_query % (repo_name, owner)
    
    response = requests.post(
        'https://api.github.com/graphql',
        json={'query': query},
        headers={'Authorization': f"bearer {github_access_token}"}
    )

    data = response.json()
    if 'errors' in data:
        LOGGER.error(f"Error for repository {repo_name} owned by {owner}: {data['errors']}")
    elif 'documentation_url' in data and 'Retry-After' in response.headers:
        LOGGER.error(f"Reached limit, retry after {response.headers['Retry-After']} seconds.")
        time.sleep(int(response.headers['Retry-After']))
    else:
        repositoryData = data['data']['repository']
        result = {
            'id': repositoryData['id'],
            'repository': f"{owner}/{repo_name}",
            'name': repositoryData['name'],
            'homepageUrl': repositoryData['homepageUrl'],
            'createdAt': repositoryData['createdAt'],
            'pushedAt': repositoryData['pushedAt'],
            'updatedAt': repositoryData['updatedAt'],
            'description': repositoryData['description'],
            'stargazerCount': repositoryData['stargazerCount'],
            'forkCount': repositoryData['forkCount'],
            'watcherCount': repositoryData['watchers']['totalCount'],
            'primaryLanguage': repositoryData['primaryLanguage'],
            'latestRelease': repositoryData['latestRelease'],
            'licenseInfo': repositoryData['licenseInfo'],
            'codeOfConduct': repositoryData['codeOfConduct'],
            'contributingGuidelines': repositoryData['contributingGuidelines'],
            'issueTemplates': None if repositoryData['issueTemplates'] == [] else repositoryData['issueTemplates'],
            'issueCount': repositoryData['issues']['totalCount'],
            'pullRequestCount': repositoryData['pullRequests']['totalCount'],
            'pullRequestTemplates': None if repositoryData['pullRequestTemplates'] == [] else repositoryData['pullRequestTemplates'],
            'assignableUsers': repositoryData['assignableUsers'],
            'labels': repositoryData['labels'],
            'languages': repositoryData['languages']
        }
        
        LOGGER.info(f"Saving repo {owner}/{repo_name}")
        RepositoryDetailsWrapper.save_one(result)


repositories = RepositoryWrapper.read({})
skip_list = [""]

count_all = RepositoryWrapper.count_all({})

index = 0

# Loop through repositories and fetch their details
for repo in repositories:
    
    index += 1
    LOGGER.info(f"=== PR {index} of {count_all}. {index*100/count_all:.2f}% ===")
    
    
    repo_handle = repo.name
    
    if repo_handle in skip_list:
        LOGGER.info(f"=== SKIP {repo_handle} ===")
        continue
    
    repo_name = repo_handle.split('/')[1]
    owner = repo_handle.split('/')[0]

    LOGGER.info(f"=== FETCHING {repo_handle} Details ===")
    fetch_and_store_repo_details(repo_name, owner)
