import Chart from 'chart.js/auto';

export function createDoughnutChart(ctx, labels, data, chartId) {
    const existingChart = Chart.getChart(chartId);
    if (existingChart) {
        existingChart.destroy();
    }

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [
                {
                    label: chartId,
                    data,
                },
            ],
        },
    });
}

export function createBarChart(ctx, labels, data, chartId, barLabel, options = {}) {
    const existingChart = Chart.getChart(chartId);
    if (existingChart) {
        existingChart.destroy();
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: barLabel,
                    data,
                },
            ],
        },
        options,
    });
}
