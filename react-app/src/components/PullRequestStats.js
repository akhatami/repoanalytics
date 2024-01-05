import React, {useEffect, useState} from 'react';
import axios from "axios";
import InfoBox from "./InfoBox";
import { calculateAverages, calculateTotalParticipants } from '../helpers/statistics';
import Loading from "./Loading";

function calcStats(data){
    const totalPRs = data.length;

    const averageAdditions = calculateAverages(data, 'additions').toFixed(2);
    const averageDeletions = calculateAverages(data, 'deletions').toFixed(2);
    const averageChangedFiles = calculateAverages(data, 'changedFiles').toFixed(2);

    const totalParticipants = calculateTotalParticipants(data);
    const averageParticipants = totalParticipants / totalPRs;

    // Calculate the average number of comments per PR
    const totalComments = data.reduce((sum, pr) => sum + pr.comments.totalCount, 0);
    const averageComments = (totalComments / totalPRs).toFixed(2);

    // Calculate the average time taken for a PR to be reviewed and closed
    const reviewTimes = data
        .filter(pr => pr.merged && pr.closedAt) // Filter merged and closed PRs
        .map(pr => (new Date(pr.closedAt) - new Date(pr.createdAt)) / (1000 * 3600 * 24)); // Calculate review time in days

    const averageReviewTime = (reviewTimes.reduce((sum, time) => sum + time, 0) / reviewTimes.length).toFixed(2);

    return {averageAdditions, averageDeletions, averageChangedFiles,
        averageParticipants, averageComments,
        averageReviewTime};
}

function PullRequestStats({ repo_handle }){
    const [jsonData, setJsonData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/pulls/${repo_handle}`);
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
    }, [repo_handle]);

    useEffect(() => {
        const updateStats = () => {
            if (jsonData) {
                const calculatedStats = calcStats(jsonData);
                setStats(calculatedStats);
            }
        };

        updateStats();
    }, [jsonData, calcStats]);

    return(
    <>
        <div className="row-sm-12">
            <h4 className="mb-3">Pull Requests Stats <span className="small">over the last 100 PRs</span></h4>
        </div>
            {loading ? (
                <Loading containerHeight='15vh'/>
            ) : (
                <>
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
                    <InfoBox colSize="3" color="green" iconClass="fa-chart-bar" text="More Stats" path={`/${repo_handle}/pulls`} />
                </>
            )}
    </>
    );
}

export default PullRequestStats;
