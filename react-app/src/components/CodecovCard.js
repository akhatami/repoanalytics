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
function CodecovCard({ repo_handle }){
    const [chartData, setChartData] = useState(null);
    useEffect(() => {
        async function fetchCodecovDetails() {
            try {
                const response = await axios.get(`/api/codecov/${repo_handle}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching repo details:', error);
                return null;
            }
        }

        fetchCodecovDetails()
            .then((data) => {
                if (!data) {
                    setChartData(null);
                } else if (data[0] === 'NOT FOUND'){
                    setChartData(['NOT FOUND']);
                } else {
                    let labels = [];
                    let datasetData = [];

                    for (let coverage of data) {
                        const date = new Date(coverage.timestamp);
                        const options = { year: 'numeric', month: 'short', day: 'numeric' };
                        const dateString = date.toLocaleDateString(undefined, options);
                        labels.push(dateString);
                        datasetData.push(coverage.avg);
                    }

                    if (labels.length > 50){
                        labels = labels.slice(-50);
                        datasetData = datasetData.slice(-50);
                    }

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
                    <Typography variant={"h5"}>Codecov code coverage</Typography>
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
export default CodecovCard;