import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import PullRequestTable from './PullRequestTable';
import PullRequestCommitPopup from "./PullRequestCommitPopup";
import axios from "axios";

const PullRequestCard = ({ repo_handle }) => {
    const [jsonData, setJsonData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCommitDetailsOpen, setCommitDetailsOpen] = useState(false);
    const [selectedPullId, setSelectedPullId] = useState(null);
    const handleCommitDetailsClick = (pullId) => {
        setSelectedPullId(pullId);
        setCommitDetailsOpen(true);
    };

    const handleCloseCommitDetails = () => {
        setSelectedPullId(null);
        setCommitDetailsOpen(false);
    };

    useEffect(() => {
        // Make the API request using Axios
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

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    Pull Requests for {repo_handle}
                </Typography>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <PullRequestTable
                        data={jsonData}
                        handleCommitDetailsClick={handleCommitDetailsClick}
                    />
                )}
            </CardContent>
            <PullRequestCommitPopup
                isOpen={isCommitDetailsOpen}
                onClose={handleCloseCommitDetails}
                pullId={selectedPullId}
                repo_handle={repo_handle}
            />
        </Card>
    );
};

export default PullRequestCard;
