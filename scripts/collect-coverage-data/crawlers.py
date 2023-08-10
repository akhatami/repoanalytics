"""CRAWLERS
Methods to crawl data
"""

import pandas as pd
import requests

# # Package # #
from .models.repository import Repository
from ..config import settings

class CrawlerService:
    @staticmethod
    def get_readme(repo: Repository):
        url = f'https://github.com/{repo.name}/blob/{repo.default_branch}/README.md'
        response = requests.get(url)
        return response.text

    @staticmethod
    def get_codecov_data(repo: Repository):
        split_str = repo.name.split('/')
        owner_username = split_str[0]
        repo_name = split_str[1]
        url_commit_coverage_totals = f"https://api.codecov.io/api/v2/github/{owner_username}/repos/{repo_name}/totals/?branch={repo.default_branch}"
        url_coverage_trend = f"https://api.codecov.io/api/v2/github/{owner_username}/repos/{repo_name}/coverage/?branch={repo.default_branch}&interval=1d"
        headers = {
            "accept": "application/json",
            "authorization": f"Bearer {settings.CODECOV_TOKEN}"
        }

        response_totals = requests.get(url_commit_coverage_totals, headers=headers)
        response_trend = requests.get(url_coverage_trend, headers=headers)
        pass

    @staticmethod
    def get_coveralls_data(repo: Repository):
        # Call Coveralls API
        pass

    @staticmethod
    def get_codeclimate_data(repo: Repository):
        # Call Coveralls API
        pass
