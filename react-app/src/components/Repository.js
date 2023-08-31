import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

function Repository() {
    const { user, repo_name } = useParams();
    const [repo, setRepo] = useState(null);

    useEffect(() => {
        async function fetchRepoDetails() {
            try {
                return await axios.get(`/api/repo/${user}/${repo_name}`);
            } catch (error) {
                console.error('Error fetching repo details:', error);
                return null;
            }
        }

        fetchRepoDetails()
            .then(response => {
                if(!response){
                    setRepo(null);
                }
                setRepo(response.data);
        })
            .catch(error => {
                console.error(error);
                setRepo([]); // set empty state on error
            });

    }, [user, repo_name]);

    return (
        <>

            <Card>
            {repo ? (
                repo[0] !== 'NOT FOUND' ? (

                    <CardContent>
                        <Button variant="outlined" href="/">Other Repositories</Button>
                        <Typography variant={"h5"}>Name: {repo.name}</Typography>
                        <Typography>Language: {repo.language}</Typography>
                        <Typography>Default Branch: {repo.default_branch}</Typography>
                        <Typography>Has Codecov: {repo.has_codecov ? 'Yes' : 'No'}</Typography>
                        <Typography>Has Coveralls: {repo.has_coveralls ? 'Yes' : 'No'}</Typography>
                        <Typography>Has Codeclimate: {repo.has_codeclimate ? 'Yes' : 'No'}</Typography>
                        <Typography>Created At: {new Date(repo.created_at * 1000).toLocaleString()}</Typography>
                        <Typography>Updated At: {new Date(repo.updated_at * 1000).toLocaleString()}</Typography>
                    </CardContent>


                ) : (
                    <Typography>Repo not found.</Typography>
                )
            ) : (
                <Typography>Loading...</Typography>
            )}
            </Card>
        </>
    );
}

export default Repository;