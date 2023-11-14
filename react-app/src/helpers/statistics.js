export function calculateAverages(data, property) {
    const total = data.reduce((sum, pr) => sum + pr[property], 0);
    return total / data.length;
}

export function calculateDistribution(data, property) {
    return data.reduce((acc, pr) => {
        const key = pr[property].login;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
}

export function calculateTotalParticipants(data) {
    return data.reduce((sum, pr) => sum + pr.participants.totalCount, 0);
}

export function getTopContributors(authorsDistribution) {
    return Object.entries(authorsDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .reduce((acc, [author, commits]) => {
            acc[author] = commits;
            return acc;
        }, {});
}
