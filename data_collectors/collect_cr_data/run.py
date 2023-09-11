from data_collectors.models import Repository
from data_collectors.wrappers import *
import requests

# Your GitHub access token
github_access_token = "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"

# Define your GraphQL query
graphql_query = '''
{
  repository(name: "%s", owner: "%s") {
    id
    pullRequests(first: 50, orderBy: {field: CREATED_AT, direction: DESC}%s) {
      totalCount
      nodes {
        id
        merged
        participants {
          totalCount
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
        reviewDecision
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
          }
        }
        commits {
          totalCount
        }
        permalink
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    pullRequestTemplates {
      filename
      body
    }
  }
}
'''

# Function to fetch and store pull requests
def fetch_and_store_pull_requests(repo_name, owner):
    end_cursor = None

    while True:
        after_param = ', after: "%s"' % end_cursor if end_cursor else ''
        print(f"Making request for {owner}/{repo_name} with after param: {after_param}")
        response = requests.post(
            'https://api.github.com/graphql',
            json={'query': graphql_query % (repo_name, owner, after_param)},
            headers={'Authorization': "bearer " + github_access_token}
        )

        data = response.json()
        if 'errors' in data:
            print(f"Error for repository {repo_name} owned by {owner}: {data['errors']}")
            break

        repository_data = data['data']['repository']
        pull_requests = repository_data['pullRequests']
        nodes = pull_requests['nodes' ]

        new_nodes = []
        for node in nodes:
          existing_pull_request = PullRequestsWrapper.get(node['id'])
          if existing_pull_request is None:
                # Pull request doesn't exist in the database, so insert it
                # Add the repository name to each node before inserting
                node['repository'] = f'{owner}/{repo_name}'
                new_nodes.append(node)
          else:
            print("Redundant batch.")
            break
                
        print(f"{len(new_nodes)} new records.")
        # Store the retrieved pull requests in MongoDB
        if new_nodes:
          print(f"Saving {len(new_nodes)} for {owner}/{repo_name}")
          PullRequestsWrapper.save_many(new_nodes)

        # Check if there are more pages
        if not pull_requests['pageInfo']['hasNextPage']:
            break

        end_cursor = pull_requests['pageInfo']['endCursor']



repositories = RepositoryWrapper.read()
skip_list = ['dropwizard/dropwizard', 'movingblocks/terasology', 'jsqlparser/jsqlparser', 'rajawali/rajawali',
             'fluentlenium/fluentlenium', 'stripe/stripe-java', 'zxing/zxing', 'alibaba/fastjson', 'alibaba/druid',
             'fasterxml/jackson-core', 'togglz/togglz', 'pgjdbc/pgjdbc', 'oshi/oshi', 'find-sec-bugs/find-sec-bugs',
             'pmd/pmd', 'zeromq/jeromq', 'anysoftkeyboard/anysoftkeyboard']
# error while fetching opentripplanner/opentripplanner

# Loop through repositories and fetch pull requests
for repo in repositories:
    repo_handle = repo.name
    
    if repo_handle in skip_list:
      print(f"{repo_handle} is skipped.")
      continue
    
    repo_name = repo_handle.split('/')[1]
    owner = repo_handle.split('/')[0]

    print(f"Fetching pull requests for repository {repo_name} owned by {owner}")
    fetch_and_store_pull_requests(repo_name, owner)

