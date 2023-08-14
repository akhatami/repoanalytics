"""CRAWLERS
Methods to crawl data
"""

import pandas as pd
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
    def get_coveralls_data(repo: Repository):
        # Call Coveralls API / crawler
        pass

    @staticmethod
    def get_codeclimate_data(repo: Repository):
        # Call CodeClimate API / crawler
        pass
