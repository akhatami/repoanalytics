import React, {useEffect, useState} from 'react';
import { Dialog, DialogContent, Typography } from '@mui/material';
import axios from "axios";
import CommitTable from "./CommitTable";

function PullRequestCommitPopup({ isOpen, onClose, pullId, repo_handle }) {
    const [jsonData, setJsonData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Make the API request using Axios
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/statusChecks/${repo_handle}/${pullId}`);
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
    }, [pullId, repo_handle]);

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
            <DialogContent>
                <Typography variant="h6">
                    Pull Request #{ pullId } Commits - Repository: { repo_handle }
                </Typography>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <CommitTable
                        data={jsonData}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

export default PullRequestCommitPopup;
