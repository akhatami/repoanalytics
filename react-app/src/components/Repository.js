import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CodecovCard from "./CodecovCard";
import CoverallsCard from "./CoverallsCard";
import ResponsiveAppBar from "./ResponsiveAppBar";

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
            <ResponsiveAppBar/>
            {/*<Button variant="outlined" href="/">Other Repositories</Button>*/}
            {repo ? (
                repo[0] !== 'NOT FOUND' ? (
                    <Card>
                        <CardContent>
                            <Typography variant={"h5"}>Name: {repo.name}</Typography>
                            <Typography>Language: {repo.language}</Typography>
                            <Typography>Default Branch: {repo.default_branch}</Typography>
                            <Typography>Has Codecov: {repo.has_codecov ? 'Yes' : 'No'}</Typography>
                            <Typography>Has Coveralls: {repo.has_coveralls ? 'Yes' : 'No'}</Typography>
                            <Typography>Has Codeclimate: {repo.has_codeclimate ? 'Yes' : 'No'}</Typography>
                        </CardContent>
                    </Card>
                ) : (
                    <Typography>Repo not found.</Typography> // improve later: 404 page
                )
            ) : (
                <Typography>Loading...</Typography> // improve later: better UI/UX
            )}
            <CodecovCard
                repo_handle={user+'/'+repo_name}
            />
            <CoverallsCard
                repo_handle={user+'/'+repo_name}
            />
        </>
    );
}

export default Repository;