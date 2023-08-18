from .models.repository import Repository
from .wrappers import *
from .crawlers import CrawlerService

def add_coverage_tool():
    
    index = 0
    for project in ProjectWrapper.list():
        index += 1
        found = False
        has_codecov = 0
        has_coveralls = 0
        has_codeclimate = 0

        repo = project['name']
        language = project['mainLanguage']
        default_branch = project['defaultBranch']

        read_me = CrawlerService.get_readme(repo, default_branch)

        # Check for Codecov
        codecov_string = f'codecov.io'
        if codecov_string in read_me:
            found = True
            has_codecov = 1

        # Check for Coveralls
        coveralls_string = f'coveralls.io'
        if coveralls_string in read_me:
            found = True
            has_coveralls = 1

        # Check for Code Climate
        codeclimate_string = "codeclimate.com"
        if codeclimate_string in read_me:
            found = True
            print(f"{repo} has Code Climate")
            has_codeclimate = 1

        if found:
            repository = Repository(name=repo,
                                    language=language,
                                    default_branch=str(default_branch),
                                    has_codecov=has_codecov,
                                    has_coveralls=has_coveralls,
                                    has_codeclimate=has_codeclimate)
            RepositoryWrapper.create_or_update(repository)
        if index == 100:
            break

def collect_codecov():
    codecov_repos = RepositoryWrapper.read(query={"has_codecov": 1})
    for repo in codecov_repos:
        data = CrawlerService.get_codecov_data(repo)
        if len(data) == 0:
            continue 
        CodecovCoverageTrendWrapper.save_many(data)

def collect_coveralls():
    coverall_repos = RepositoryWrapper.read(query={"has_coveralls": 1})
    collected_repos = [x.lower() for x in CoverallsCoverageWrapper.distinct_repos()]
    for repo in coverall_repos:
        if repo.name in collected_repos:
            continue
        data = CrawlerService.get_coveralls_data(repo)
        if len(data) == 0:
            continue 
        CoverallsCoverageWrapper.save_many(data)
        
# add_coverage_tool()
# collect_codecov()
# collect_coveralls()
