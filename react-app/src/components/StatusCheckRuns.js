import React, {useEffect, useState} from 'react';
import axios from "axios";
import InfoBox from "./InfoBox";

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
    const appCount = {};
    const statusCount = {};

    // Iterate over the properties of the data object
    for (const record of data) {
        const numContexts = record.contexts_total_count;

        if (numContexts === null) {
            continue;
        }

        for (const context of record.contexts) {
            // Check if context.startedAt and context.completedAt exist
            if (context.startedAt && context.completedAt && context.conclusion === "SUCCESS") {
                const startTime = new Date(context.startedAt);
                const endTime = new Date(context.completedAt);

                // Calculate the run time in milliseconds
                const runTime = endTime - startTime;

                // For example, you can convert it to minutes:
                const runTimeInSeconds = (runTime / (1000));
                runTimeTotal += runTimeInSeconds;
                runTimeCount++;

            } else {
                if (context.state === "SUCCESS") {
                    const statusName = context.context;
                    const statusDescription = context.description;
                    const statusUrl = context.targetUrl;
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
                }
                continue;
            }

            // Find the name and slug of the app from context.checkSuite.app
            const appName = context.checkSuite.app.name;
            const appSlug = context.checkSuite.app.slug;
            const appUrl = context.checkSuite.app.url;

            // Add the app to the dictionary and increment the count
            if (appCount[appSlug]) {
                appCount[appSlug].count++;
            } else {
                appCount[appSlug] = {
                    name: appName,
                    url: appUrl,
                    count: 1,
                };
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

        totalContexts += numContexts;
        recordCount++;
    }

    // Calculate the average number of contexts
    const averageContexts = totalContexts / recordCount;
    const successRate = (successfulRollupState / recordCount) * 100;
    const runTimeAverage = runTimeTotal / runTimeCount;

    // console.log('Maximum number of contexts for a PR commit record:', maxContexts, maxContextsPRNumber);
    // console.log('Minimum number of contexts for a PR commit record:', minContexts, minContextsPRNumber);
    // console.log('Average number of contexts for a PR commit record:', averageContexts.toFixed(2));
    // console.log('Total records with contexts (commits):', recordCount);
    // console.log('Successful context records:', successfulRollupState);
    // console.log('Success Rate:', successRate.toFixed(2) + '%');
    // console.log('App Count Dictionary:', appCount);
    // console.log('Status Count Dictionary:', statusCount);
    // console.log('Run time in seconds:', runTimeAverage.toFixed(2));

    return {averageContexts, successRate, runTimeAverage, recordCount, maxContexts, minContexts};
}
function StatusCheckRuns({ repo_handle }){
    const [statusChecks, setStatusChecks] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
            async function fetchStatusChecksDetails() {
                try {
                    const response = await axios.get(`/api/statusChecksMultiple/${repo_handle}/100`);
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

    }, [repo_handle]);

    useEffect(() => {
        if (statusChecks) {
            const calculatedStats = calcStats(statusChecks);
            setStats(calculatedStats);
        }
    }, [statusChecks]);

    return(
        <>
            {stats && (
                <>
                    <div className="row-sm-12">
                        <h4 className="mb-3">Continuous Integration Stats <span className="small">commit Checks over the last 100 PRs</span></h4>
                    </div>
                    <InfoBox
                        colSize="4"
                        color="white"
                        iconClass="fa-chart-line"
                        text="Average number of contexts per commit"
                        content={`Minimum count: ${stats.minContexts ? stats.minContexts : 'N/A'} | 
                        Maximum count: ${stats.maxContexts ? stats.maxContexts : 'N/A'}`}
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
                                <span className="info-box-text">Checks success rate</span>
                                <span className="info-box-number">Total commits: {stats.recordCount ? stats.recordCount : 'N/A'}</span>
                                <div className="progress">
                                    <div className="progress-bar bg-info" style={{ width: `${stats.successRate}%` }}></div>
                                </div>
                                <span className="progress-description">{stats.successRate.toFixed(0)}% ran successful</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

export default StatusCheckRuns;
