import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CodecovCard from "./CodecovCard";
import CoverallsCard from "./CoverallsCard";
import PullRequestCard from "./PullRequestCard";
import Breadcrumbs from "./Breadcrumbs";

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

    const breadcrumbItems = [
        { label: 'Home', link: '/' },
        { label: 'Repositories', link: '/repositories' },
        { label: `Repo: ${repo_name}`, link: '' },
    ];

    return (
        <div className="content-wrapper">
            <section className="content-header">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="mb-0">
                                {user}/{repo_name}
                            </h3>
                        </div>
                        <Breadcrumbs items={breadcrumbItems} />
                    </div>
                </div>
            </section>
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
            <PullRequestCard
                repo_handle={user+'/'+repo_name}
            />
            <CodecovCard
                repo_handle={user+'/'+repo_name}
            />
            <CoverallsCard
                repo_handle={user+'/'+repo_name}
            />
        </div>
    );
}

export default Repository;
