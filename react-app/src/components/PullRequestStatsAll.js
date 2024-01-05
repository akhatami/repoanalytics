import React, {useEffect, useState} from 'react';
import axios from "axios";
import InfoBox from "./InfoBox";
import { calculateAverages, calculateTotalParticipants } from '../helpers/statistics';
import Loading from "./Loading";

function calcStats(data) {
    const repos = Object.values(data);
    const totalRepos = repos.length;

    const repoAverages = repos.map(repo => {
        repo = repo['pulls'];
        const totalPRs = repo.length;
        console.log(repo);
        const averageAdditions = calculateAverages(repo, 'additions').toFixed(2);
        const averageDeletions = calculateAverages(repo, 'deletions').toFixed(2);
        const averageChangedFiles = calculateAverages(repo, 'changedFiles').toFixed(2);

        const totalParticipants = calculateTotalParticipants(repo);
        const averageParticipants = totalParticipants / totalPRs;

        // Calculate the average number of comments per PR
        const totalComments = repo.reduce((sum, pr) => sum + pr.comments.totalCount, 0);
        const averageComments = (totalComments / totalPRs).toFixed(2);

        // Calculate the average time taken for a PR to be reviewed and closed
        const reviewTimes = repo
            .filter(pr => pr.merged && pr.closedAt)
            .map(pr => (new Date(pr.closedAt) - new Date(pr.createdAt)) / (1000 * 3600 * 24));

        const averageReviewTime = (reviewTimes.reduce((sum, time) => sum + time, 0) / reviewTimes.length).toFixed(2);

        return {
            averageAdditions,
            averageDeletions,
            averageChangedFiles,
            averageParticipants,
            averageComments,
            averageReviewTime
        };
    });

    const overallAverages = {
        averageAdditions: (repoAverages.reduce((sum, repo) => sum + parseFloat(repo.averageAdditions), 0) / totalRepos).toFixed(2),
        averageDeletions: (repoAverages.reduce((sum, repo) => sum + parseFloat(repo.averageDeletions), 0) / totalRepos).toFixed(2),
        averageChangedFiles: (repoAverages.reduce((sum, repo) => sum + parseFloat(repo.averageChangedFiles), 0) / totalRepos).toFixed(2),
        averageParticipants: (repoAverages.reduce((sum, repo) => sum + repo.averageParticipants, 0) / totalRepos).toFixed(2),
        averageComments: (repoAverages.reduce((sum, repo) => sum + parseFloat(repo.averageComments), 0) / totalRepos).toFixed(2),
        averageReviewTime: (repoAverages.reduce((sum, repo) => sum + parseFloat(repo.averageReviewTime), 0) / totalRepos).toFixed(2),
        totalRepos: totalRepos,
    };

    return overallAverages;
}


function PullRequestStatsAll(){
    const [jsonData, setJsonData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/pulls/all`);
                return response.data;
            } catch (error) {
                console.error('Error fetching data:', error);
                return null;
            }
        };

        fetchData()
            .then((data) => {
                if (!data) {
                    setJsonData(null);
                } else{
                    setJsonData(data);
                }
            })
            .catch((error) => {
                console.error('Fetch data error:', error);
                setJsonData([])
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const updateStats = () => {
            if (jsonData) {
                const calculatedStats = calcStats(jsonData);
                setStats(calculatedStats);
            }
        };

        updateStats();
    }, [jsonData, calcStats]);

    const [isStatsOpen, setStatsOpen] = useState(false);

    const toggleStats = () => {
        setStatsOpen(!isStatsOpen);
    };
    return (
        <>
            <div className="row-sm-12">
                <h4 className="mb-3">Overall Pull Requests Stats
                    <button className="btn btn-link" onClick={toggleStats}>
                        {isStatsOpen ? (
                            <i className="fas fa-chevron-up"></i>
                        ) : (
                            <i className="fas fa-chevron-down"></i>
                        )}
                    </button>
                </h4>
            </div>
            <div className="row">
                {isStatsOpen ? (
                    loading ? (
                        <Loading containerHeight='15vh'/>
                    ) : (
                        <>
                            <p>Over {stats.totalRepos} repositories in our dataset.</p>
                            <InfoBox colSize="3" color="white" iconClass="fa-plus" text="Average Additions per PR (line)"
                                     number={stats.averageAdditions} />
                            <InfoBox colSize="3" color="white" iconClass="fa-minus" text="Average Deletions per PR (line)"
                                     number={stats.averageDeletions} />
                            <InfoBox colSize="3" color="white" iconClass="fa-file" text="Average Changed Files per PR"
                                     number={stats.averageChangedFiles} />

                            <InfoBox colSize="3" color="white" iconClass="fa-user" text="Average Participants per PR"
                                     number={stats.averageParticipants} />
                            <InfoBox
                                colSize="3"
                                color="white"
                                iconClass="fa-comments"
                                text="Average Comments per PR"
                                number={stats.averageComments}
                            />
                            <InfoBox
                                colSize="3"
                                color="white"
                                iconClass="fa-clock"
                                text="Average Review Time (days)"
                                number={stats.averageReviewTime}
                            />
                        </>
                    )
                ) : null}
            </div>
        </>
    );

}

export default PullRequestStatsAll;
