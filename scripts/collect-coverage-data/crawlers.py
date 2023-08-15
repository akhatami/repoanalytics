"""CRAWLERS
Methods to crawl data
"""

import re
import requests

# # Package # #
from .models.repository import Repository
from ..config import settings

class CrawlerService:
    headers = {
            "accept": "application/json",
            "authorization": f"Bearer {settings.CODECOV_TOKEN}"
        }
    
    @staticmethod
    def get_readme(repo_handle, default_branch):
        url = f'https://github.com/{repo_handle}/blob/{default_branch}/README.md'
        response = requests.get(url)
        return response.text

    @staticmethod
    def get_codecov_data(repo: Repository):
        split_str = repo.name.split('/')
        owner_username = split_str[0]
        repo_name = split_str[1]
        # url_commit_coverage_totals = f"https://api.codecov.io/api/v2/github/{owner_username}/repos/{repo_name}/totals/?branch={repo.default_branch}"
        # response_totals = requests.get(url_commit_coverage_totals, headers=headers)
        
        # url_coverage_trend
        api_url = f"https://api.codecov.io/api/v2/github/{owner_username}/repos/{repo_name}/coverage/?branch={repo.default_branch}&interval=1d"
        all_results = []
        
        while api_url:
            response = requests.get(api_url, headers=CrawlerService.headers)
            if response.status_code != 200:
                print("Error fetching data from API")
                return None

            data = response.json()
            for result in data["results"]:
                result["repo_name"] = repo.name
                all_results.append(result)

            api_url = data["next"]

        return all_results
    
    @staticmethod
    def extract_coveralls_url(repo: Repository):
        readme = CrawlerService.get_readme(repo.name, repo.default_branch)
        
        pattern1 = r'https?://coveralls\.io/github/[^/]+/[^?/]+'
        pattern2 = r'https?://coveralls\.io/r/[^/]+/[^?/]+'
        match1 = re.search(pattern1, readme)
        match2 = re.search(pattern2, readme)
        
        if match1:
            matched_string = match1.group()
        elif match2:
            matched_string = match2.group().replace('/r/', '/github/')
        else:
            return None
            
        index_of_first_backslash = matched_string.find('\\')
        if index_of_first_backslash != -1:
            return matched_string[:index_of_first_backslash]
        else:
            return matched_string
    
    @staticmethod
    def get_coveralls_data(repo: Repository):
        page = 0
        coveralls_url = CrawlerService.extract_coveralls_url(repo)
        
        if not coveralls_url:
            print(f'no coveralls url in readme for {repo.name}')
            return []
        
        all_results = []
        
        while len(all_results) < 1000:
            print(page)
            page += 1
            sub_string = f'.json?page={page}'
            api_url = coveralls_url + sub_string
            response = requests.get(api_url)
            
            if response.status_code != 200:
                print("Coverall API error")
                break
            
            result_json = response.json()["builds"]
            
            if len(result_json) == 0:
                break
            
            for elem in result_json:
                for field in ['commit_message', 'committer_email', 'committer_name']:
                    del elem[field]
            all_results.extend(result_json)
        
        return all_results
        
    @staticmethod
    def get_codeclimate_data(repo: Repository):
        # Call CodeClimate API / crawler
        pass
