import React, {useEffect, useState} from 'react';
import axios from "axios";
import InfoBox from "./InfoBox";
import { calculateAverages, calculateDistribution, calculateTotalParticipants, getTopContributors } from '../helpers/statistics';
import { createDoughnutChart, createBarChart } from '../helpers/chartUtils';

function calcStats(data){
    const totalPRs = data.length;

    const averageAdditions = calculateAverages(data, 'additions').toFixed(2);
    const averageDeletions = calculateAverages(data, 'deletions').toFixed(2);
    const averageChangedFiles = calculateAverages(data, 'changedFiles').toFixed(2);

    const authorsDistribution = calculateDistribution(data, 'author');
    const totalParticipants = calculateTotalParticipants(data);
    const averageParticipants = (totalParticipants / totalPRs).toFixed(2);

    const mostActiveAuthors = getTopContributors(authorsDistribution);

    const ctxAuthorDistribution = document.getElementById('authorDistributionChart');
    createDoughnutChart(ctxAuthorDistribution, Object.keys(authorsDistribution), Object.values(authorsDistribution), 'authorDistributionChart');

    // Calculate the average number of comments per PR
    const totalComments = data.reduce((sum, pr) => sum + pr.comments.totalCount, 0);
    const averageComments = (totalComments / totalPRs).toFixed(2);

    // Identify PRs with the highest number of comments
    const maxCommentsPRs = data
        .map(pr => ({
            number: pr.number,
            comments: pr.comments.totalCount,
            title: pr.title,
        }))
        .sort((a, b) => b.comments - a.comments)
        .slice(0, 5); // Get the top 5 PRs with the highest comments

    // Calculate the average time taken for a PR to be reviewed and closed
    const reviewTimes = data
        .filter(pr => pr.merged && pr.closedAt) // Filter merged and closed PRs
        .map(pr => (new Date(pr.closedAt) - new Date(pr.createdAt)) / (1000 * 3600 * 24)); // Calculate review time in days

    const averageReviewTime = (reviewTimes.reduce((sum, time) => sum + time, 0) / reviewTimes.length).toFixed(2);

    // Create a visualization for the average review time using a line chart
    const reviewTimeLabels = data
        .filter(pr => pr.merged && pr.closedAt)
        .map(pr => pr.number);
    const reviewTimeData = reviewTimes;

    const ctxReviewTime = document.getElementById('reviewTimeChart');
    createBarChart(ctxReviewTime, reviewTimeLabels, reviewTimeData, 'reviewTimeChart', 'Review Time (day)',{
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    });

    // Create labels for the x-axis
    const prNumbers = data.map(pr => pr.number);
    const additionsData = data.map(pr => pr.additions);
    const ctxAdditions = document.getElementById('additionsChart');
    createBarChart(ctxAdditions, prNumbers, additionsData, 'additionsChart', 'Additions (line)',{
        scales: {
            y: {
                type: 'logarithmic',
                beginAtZero: false,
                min: 1,
            },
        },
    });

    const deletionsData = data.map(pr => pr.deletions);
    const ctxDeletions = document.getElementById('deletionsChart');
    createBarChart(ctxDeletions, prNumbers, deletionsData, 'deletionsChart', 'Deletions (line)',{
        scales: {
            y: {
                type: 'logarithmic',
                beginAtZero: true,
            },
        },
    });

    const changedFilesData = data.map(pr => pr.changedFiles);
    const ctxChangedFiles = document.getElementById('changedFilesChart');
    createBarChart(ctxChangedFiles, prNumbers, changedFilesData, 'changedFilesChart', 'Changed Files',  {
        scales: {
            y: {
                beginAtZero: false,
                min: 1,
            },
        },
    });

    const commentsData = data.map(pr => pr.comments.totalCount);
    const ctxComments = document.getElementById('commentsChart');
    createBarChart(ctxComments, prNumbers, commentsData, 'commentsChart', 'Total Comments', {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    });

    const mergedPRDistribution = {};

    for (const pr of data) {
        if (pr.merged && pr.mergedBy && pr.mergedBy.login) {
            const mergedBy = pr.mergedBy.login;

            if (mergedPRDistribution[mergedBy]) {
                mergedPRDistribution[mergedBy]++;
            } else {
                mergedPRDistribution[mergedBy] = 1;
            }
        }
    }

    const ctxMergedPRUserChart = document.getElementById('mergedPRUserChart');
    const users = Object.keys(mergedPRDistribution);
    const mergedCounts = Object.values(mergedPRDistribution);
    createDoughnutChart(ctxMergedPRUserChart, users, mergedCounts, 'mergedPRUserChart');

    return {averageAdditions, averageDeletions, averageChangedFiles, maxCommentsPRs,
        authorsDistribution, averageParticipants, mostActiveAuthors, averageComments,
        averageReviewTime};
}

function PullRequestStatsMore({ repo_handle }){
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
                <p>Loading...</p>
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

                    <div className="col-md-3">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Most Active Authors</h3>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped">
                                    <thead>
                                    <tr>
                                        <th>Author</th>
                                        <th>PR Count</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {Object.entries(stats.mostActiveAuthors).map(([author, prCount]) => (
                                        <tr key={author}>
                                            <td>
                                                <a
                                                    href={`https://github.com/${author}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {author}
                                                </a>
                                            </td>
                                            <td>{prCount}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Merged PRs by User</h3>
                            </div>
                            <div className="card-body">
                                <canvas id="mergedPRUserChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Author Distribution</h3>
                            </div>
                            <div className="card-body">
                                <canvas id="authorDistributionChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <InfoBox
                        colSize="3"
                        color="white"
                        iconClass="fa-comments"
                        text="Average Comments per PR"
                        number={stats.averageComments}
                    />
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">PRs with Highest Comments</h3>
                            </div>
                            <div className="card-body">
                                <table className="table table-bordered table-striped">
                                    <thead>
                                    <tr>
                                        <th>PR Number</th>
                                        <th>Comments Count</th>
                                        <th>Title</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {stats.maxCommentsPRs.map(pr => (
                                        <tr key={pr.number}>
                                            <td>
                                                <a
                                                    href={`https://github.com/${repo_handle}/pull/${pr.number}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    #{pr.number}
                                                </a>
                                            </td>
                                            <td>{pr.comments}</td>
                                            <td>{pr.title}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <InfoBox
                        colSize="3"
                        color="white"
                        iconClass="fa-clock"
                        text="Average Review Time (days)"
                        number={stats.averageReviewTime}
                    />
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Average Review Time per PR</h3>
                            </div>
                            <div className="card-body">
                                <canvas id="reviewTimeChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Additions per PR</h3>
                                </div>
                                <div className="card-body">
                                    <canvas id="additionsChart"></canvas>
                                </div>
                            </div>
                    </div>
                    <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Deletions per PR</h3>
                                </div>
                                <div className="card-body">
                                    <canvas id="deletionsChart"></canvas>
                                </div>
                            </div>
                    </div>
                    <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Changed Files per PR</h3>
                                </div>
                                <div className="card-body">
                                    <canvas id="changedFilesChart"></canvas>
                                </div>
                            </div>
                    </div>
                    <div className="col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Total Comments per PR</h3>
                                </div>
                                <div className="card-body">
                                    <canvas id="commentsChart"></canvas>
                                </div>
                            </div>
                    </div>
                </>
            )}
    </>
    );
}

export default PullRequestStatsMore;
