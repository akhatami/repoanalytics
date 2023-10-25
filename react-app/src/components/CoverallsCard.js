import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top'
        },
        title: {
            display: false,
            text: 'Title',
        },
    },
};
function CoverallsCard({ repo_handle }){
    const [chartData, setChartData] = useState(null);
    useEffect(() => {
        async function fetchCoverallsDetails() {
            try {
                const response = await axios.get(`/api/coveralls/${repo_handle}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching repo details:', error);
                return null;
            }
        }

        fetchCoverallsDetails()
            .then((data) => {
                if (!data) {
                    setChartData(null);
                } else if (data[0] === 'NOT FOUND'){
                    setChartData(['NOT FOUND']);
                } else {
                    let labels = [];
                    let datasetData = [];

                    for (let coverage of data) {
                        const date = new Date(coverage.created_at);
                        const options = { year: 'numeric', month: 'short', day: 'numeric' };
                        const dateString = date.toLocaleDateString(undefined, options);
                        labels.push(dateString);
                        datasetData.push(coverage.covered_percent);
                    }

                    // if (labels.length > 10){
                    //     labels = labels.slice(10);
                    //     datasetData = datasetData.slice(10);
                    // }

                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: 'Code coverage',
                                data: datasetData,
                                borderColor: 'rgb(75, 192, 192)',
                                tension: 0.1,
                            },
                        ],
                    });

                }
            })
            .catch((error) => {
                console.error(error);
                setChartData([]);
            });
    }, [repo_handle]);

    return (
        <>
            <Card>
                <CardContent>
                    <Typography variant={"h5"}>Coveralls code coverage</Typography>
                    {chartData ? (
                        chartData[0] !== 'NOT FOUND' ? (
                            <Line options={options} data={chartData} />
                        ) : (
                            <Typography>NOT FOUND</Typography>
                        )
                    ) : (
                        <Typography>Loading...</Typography>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
export default CoverallsCard;
