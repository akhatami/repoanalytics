import React, {useEffect, useState} from 'react';
import axios from "axios";
import InfoBox from "./InfoBox";
import Loading from "./Loading";

function calcStats(data) {
    // Initialize variables for calculations
    let maxContexts = 0;
    let maxContextsPRNumber = null;
    let minContexts = Infinity;
    let minContextsPRNumber = null;
    let totalContexts = 0;
    let recordCount = 0;
    let successfulRollupState = 0;
    let runTimeTotal = 0;
    let runTimeCount = 0;
    const topUsedApps = {};
    const statusCount = {};
    const failedChecks = {};
    const unsuccessfulStatuses = {};

    // Iterate over the properties of the data object
    for (const record of data) {
        const numContexts = record.contexts_total_count;

        if (numContexts === null) {
            continue;
        }
        totalContexts += numContexts;

        for (const context of record.contexts) {

            if (context.startedAt && context.completedAt){
                // Find the name and slug of the app from context.checkSuite.app
                const appName = context.checkSuite.app.name;
                const appSlug = context.checkSuite.app.slug;
                const appUrl = context.checkSuite.app.url;

                // Add the app to the dictionary and increment the count
                if (topUsedApps[appSlug]) {
                    topUsedApps[appSlug].count++;
                } else {
                    topUsedApps[appSlug] = {
                        name: appName,
                        url: appUrl,
                        count: 1,
                    };
                }
            }


            if (context.startedAt && context.completedAt && context.conclusion === "FAILURE" && context.status === "COMPLETED") {
                // A completed check that is failed
                const name = context.name || 'Unknown';

                // Group failed checks into different categories based on their name
                if (failedChecks[name]) {
                    failedChecks[name].count++;
                } else {
                    failedChecks[name] = {
                        count: 1,
                        appName: context.checkSuite.app.name,
                        appUrl: context.checkSuite.app.url,
                    };
                }

            }

            if (context.startedAt && context.completedAt && context.conclusion === "SUCCESS" && context.status === "COMPLETED") {
                // A successful check (not status)
                const startTime = new Date(context.startedAt);
                const endTime = new Date(context.completedAt);

                // Calculate the run time in milliseconds
                const runTime = endTime - startTime;

                // For example, you can convert it to minutes:
                const runTimeInSeconds = (runTime / (1000));
                runTimeTotal += runTimeInSeconds;
                runTimeCount++;

            } else {
                // Either an unsuccessful check or a status
                if (context.state === "SUCCESS") {
                    // A successful status
                    const statusName = context.context;
                    const statusDescription = context.description;
                    const statusUrl = context.targetUrl;
                    // Count status
                    if (statusCount[statusName]) {
                        statusCount[statusName].count++;
                    } else {
                        statusCount[statusName] = {
                            name: statusName,
                            url: statusUrl,
                            description: statusDescription,
                            count: 1,
                        };
                    }
                }else{
                    // A unsuccessful status
                    if (context.state === "ERROR" || context.state === "FAILURE") {
                        const name = context.context || 'Unknown';

                        // Group unsuccessful checks into different categories based on their name
                        if (unsuccessfulStatuses[name]) {
                            unsuccessfulStatuses[name].count++;
                        } else {
                            unsuccessfulStatuses[name] = {
                                count: 1,
                            };
                        }
                    }
                }
            }

        }

        if (numContexts > maxContexts) {
            maxContexts = numContexts;
            maxContextsPRNumber = record.pull_request_number;
        }
        if (numContexts < minContexts) {
            minContexts = numContexts;
            minContextsPRNumber = record.pull_request_number;
        }

        const statusCheckRollupState = record.status_check_rollup_state;
        if (statusCheckRollupState === 'SUCCESS') {
            successfulRollupState++;
        }
        // records (commits) that have contexts
        recordCount++;
    }

    // Calculate the average number of contexts
    const averageContexts = totalContexts / recordCount;
    const successRate = (successfulRollupState / recordCount) * 100;
    const runTimeAverage = runTimeTotal / runTimeCount;

    const allFailedChecks = {...failedChecks, ...unsuccessfulStatuses}
    const commitCount = data.length;
    return {averageContexts, successRate, runTimeAverage, recordCount, maxContexts, minContexts, allFailedChecks, totalContexts, commitCount, topUsedApps};
}
function StatusCheckRunsAll(){
    const [statusChecks, setStatusChecks] = useState(null);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStatusChecksDetails() {
            try {
                const response = await axios.get(`/api/statusChecks/all/2023-09-01`);
                if (response) {
                    return response;
                }
            } catch (error) {
                console.error('Error fetching repo details:', error);
            }
        }

        fetchStatusChecksDetails()
            .then(response => {
                if (response) {
                    setStatusChecks(response.data);
                } else {
                    setStatusChecks(null);
                }
            })
            .catch(error => {
                console.error(error);
                setStatusChecks([]); // set empty state on error
            });

    }, []);

    useEffect(() => {
        if (statusChecks) {
            const calculatedStats = calcStats(statusChecks);
            setStats(calculatedStats);
            setLoading(false);
        }
    }, [statusChecks]);

    const [isStatsOpen, setStatsOpen] = useState(false);

    const toggleStats = () => {
        setStatsOpen(!isStatsOpen);
    };

    return(
        <>
            <div className="row-sm-12">
                <h4 className="mb-3">
                    Overall Automated Workflows Stats
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
                            <p>Over the latest PRs of projects in our dataset containing {stats.commitCount} commits, with {stats.recordCount} of them having {stats.totalContexts} checks in total.</p>
                            <InfoBox
                                colSize="4"
                                color="white"
                                iconClass="fa-chart-line"
                                text="Average number of checks per commit"
                                content={`Min: ${stats.minContexts ? stats.minContexts : 'N/A'} |  
                        Max: ${stats.maxContexts ? stats.maxContexts : 'N/A'}`}
                                number={stats.averageContexts ? stats.averageContexts.toFixed(0) : 'N/A'}
                            />
                            <InfoBox
                                colSize="4"
                                color="white"
                                iconClass="fa-clock"
                                text="Average checks run time (in minutes)"
                                number={stats.runTimeAverage ? (stats.runTimeAverage / 60).toFixed(0) : 'N/A'}
                            />

                            <div className={`col-lg-4 info-box-container`}>
                                <div className="info-box">
                                    <span className="info-box-icon bg-info"><i className="fas fa-list-alt"></i></span>
                                    <div className="info-box-content">
                                        <span className="info-box-text">Success rate</span>
                                        <span className="info-box-number">Total commits: {stats.recordCount ? stats.recordCount : 'N/A'}</span>
                                        <div className="progress">
                                            <div className="progress-bar bg-info" style={{ width: `${stats.successRate}%` }}></div>
                                        </div>
                                        <span className="progress-description">{stats.successRate.toFixed(0)}% were successful</span>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card">
                                    <div className="card-header">
                                        <h3 className="card-title">Top Used Apps</h3>
                                    </div>
                                    <div className="card-body">
                                        <div className="table-responsive">
                                            <table className="table table-bordered table-striped">
                                                <thead>
                                                <tr>
                                                    <th>App Name</th>
                                                    <th># of Check Runs</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {Object.entries(stats.topUsedApps)
                                                    .sort(([, a], [, b]) => b.count - a.count) // Sort by count in descending order
                                                    .slice(0, 5) // Take only the top 5 entries
                                                    .map(([appName, appInfo]) => (
                                                        <tr key={appName}>
                                                            <td>
                                                                {appInfo.url ? (
                                                                    <a href={appInfo.url} target="_blank" rel="noopener noreferrer">
                                                                        {appInfo.name}
                                                                    </a>
                                                                ) : appInfo.name}
                                                            </td>
                                                            <td>{appInfo.count}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                        )
                ) : null}
            </div>
        </>
    );
}

export default StatusCheckRunsAll;
