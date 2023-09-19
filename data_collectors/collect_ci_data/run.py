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
    pullRequest(number: %s) {
      id
      commits(first: 100) {
        totalCount
        nodes {
          url
          commit {
            id
            message
            oid
            statusCheckRollup {
              state
              contexts(first: 100) {
                totalCount
                nodes {
                  ... on StatusContext {
                    id
                    state
                    context
                    targetUrl
                    createdAt
                    description
                  }
                  ... on CheckRun {
                    id
                    name
                    conclusion
                    detailsUrl
                    status
                    summary
                    text
                    title
                    url
                    completedAt
                    startedAt
                    checkSuite {
                      id
                      app {
                        name
                        slug
                        url
                        id
                      }
                    }
                  }
                }
                checkRunCount
              }
              id
            }
          }
        }
      }
    }
  }
}
'''

# Function to fetch and store commits status checks
def fetch_and_store_commits_of_pr(repo_name, owner, pull_request_number):
    LOGGER.info(f"Making request for {owner}/{repo_name} PR number: {pull_request_number}")
    
    query = graphql_query % (repo_name, owner, pull_request_number)
    
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
        pull_request_data = data['data']['repository']['pullRequest']

        
        commits = pull_request_data['commits']
        LOGGER.info(f"Total commits: {commits['totalCount']}")
        nodes = commits['nodes']

        commit_index = 0
        for node in nodes:
            commit_index += 1
            if node['commit']['statusCheckRollup'] is None:
                result = {
                    'repository': f"{owner}/{repo_name}",
                    'pull_request_number': pull_request_number,
                    'pull_request_id': pull_request_data['id'],
                    'commits_count': pull_request_data['commits']['totalCount'],
                    'commits_url': node['url'],
                    'commit_message': node['commit']['message'],
                    'commit_oid': node['commit']['oid'],
                    'commit_id': node['commit']['id'],
                    'status_check_rollup_state': None,
                    'status_check_rollup_id': None,
                    'contexts_total_count': None,
                    'contexts_checkRun_count': None,
                    'contexts': None
                }
            else:
                result = {
                    'repository': f"{owner}/{repo_name}",
                    'pull_request_number': pull_request_number,
                    'pull_request_id': pull_request_data['id'],
                    'commits_count': pull_request_data['commits']['totalCount'],
                    'commits_url': node['url'],
                    'commit_message': node['commit']['message'],
                    'commit_oid': node['commit']['oid'],
                    'commit_id': node['commit']['id'],
                    'status_check_rollup_state': node['commit']['statusCheckRollup']['state'],
                    'status_check_rollup_id': node['commit']['statusCheckRollup']['id'],
                    'contexts_total_count': node['commit']['statusCheckRollup']['contexts']['totalCount'],
                    'contexts_checkRun_count': node['commit']['statusCheckRollup']['contexts']['checkRunCount'],
                    'contexts': node['commit']['statusCheckRollup']['contexts']['nodes']
                }
            LOGGER.info(f"Saving commit {commit_index} of {pull_request_data['commits']['totalCount']} for {owner}/{repo_name}")
            CommitStatusCheckWrapper.save_one(result)

skip_repositories = [""]
pullRequests = PullRequestWrapper.read({"repository":{"$nin": skip_repositories}})
count_all_pr = PullRequestWrapper.count_all({"repository":{"$nin": skip_repositories}})

index = 0
# Loop through repositories and fetch pull requests
for pullRequest in pullRequests:
    
    index += 1
    LOGGER.info(f"=== PR {index} of {count_all_pr}. {index/count_all_pr:.4f}% ===")
    
    pr_number = pullRequest['number']
    repo_handle = pullRequest['repository']
    existing_record = CommitStatusCheckWrapper.get_by_repo_and_pr(repo_handle=repo_handle, 
                                                    pr_number=pr_number)
    
    if existing_record:
        LOGGER.info(f"=== SKIP PR {pr_number} of {repo_handle}")
        continue
    
    
    repo_name = repo_handle.split('/')[1]
    owner = repo_handle.split('/')[0]

    LOGGER.info(f"=== FETCHING PR {pr_number} of {repo_handle} ===")
    fetch_and_store_commits_of_pr(repo_name, owner, pr_number)

pullRequests.close()
