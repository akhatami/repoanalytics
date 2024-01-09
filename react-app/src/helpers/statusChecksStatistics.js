export function processFailedChecks(context, failedChecks) {
    if (isFailedCheck(context)) {
        const name = context.name || 'Unknown';
        const appName = context.checkSuite.app.name;
        const appUrl = context.checkSuite.app.url;

        failedChecks[name] = failedChecks[name] || {
            count: 0,
            appName,
            appUrl,
        };

        failedChecks[name].count++;
    }
}

export function processSuccessfulChecks(context, runTimeTotal, runTimeCount) {
    if (isSuccessfulCheck(context)) {
        const { runTimeInSeconds } = calculateRunTime(context);
        runTimeTotal += runTimeInSeconds;
        runTimeCount++;
    }
}

export function processStatus(context, statusCount, unsuccessfulStatuses) {
    if (isSuccessfulStatus(context)) {
        const { name, url, description } = context;
        statusCount[name] = statusCount[name] || { name, url, description, count: 0 };
        statusCount[name].count++;
    } else if (isUnsuccessfulStatus(context)) {
        const name = context.context || 'Unknown';
        unsuccessfulStatuses[name] = unsuccessfulStatuses[name] || { count: 0 };
        unsuccessfulStatuses[name].count++;
    }
}

function isFailedCheck(context) {
    return context.startedAt && context.completedAt && context.conclusion === 'FAILURE' && context.status === 'COMPLETED';
}

function isSuccessfulCheck(context) {
    return context.startedAt && context.completedAt && context.conclusion === 'SUCCESS' && context.status === 'COMPLETED';
}

function calculateRunTime(context) {
    const startTime = new Date(context.startedAt);
    const endTime = new Date(context.completedAt);
    const runTime = endTime - startTime;
    const runTimeInSeconds = runTime / 1000;

    return { runTime, runTimeInSeconds };
}

function isSuccessfulStatus(context) {
    return context.state === 'SUCCESS';
}

function isUnsuccessfulStatus(context) {
    return context.state === 'ERROR' || context.state === 'FAILURE';
}
