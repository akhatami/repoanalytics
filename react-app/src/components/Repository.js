import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import CodecovCard from "./CodecovCard";
import CoverallsCard from "./CoverallsCard";
import PullRequestCard from "./PullRequestCard";
import Breadcrumbs from "./Breadcrumbs";
import StatusCheckRuns from "./StatusCheckRuns";
import TestingStats from "./TestingStats";
import PullRequestStats from "./PullRequestStats";
import GuidelinesStats from "./GuidelinesStats";

function Repository() {
    const { user, repo_name } = useParams();
    const [repo, setRepo] = useState(null);

    useEffect(() => {
        async function fetchRepoDetails() {
            try {
                const response = await axios.get(`/api/repo/${user}/${repo_name}`);
                return response;
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

            {repo ? (
                repo[0] !== 'NOT FOUND' ? (
                        <div className="col-sm-6">
                            <h3 className="mb-0">
                                <span style={{ marginRight: '8px' }}>{user}/{repo_name}</span>
                                <a href={`https://github.com/${user}/${repo_name}`} target="_blank" rel="noopener noreferrer">
                                    <i className="fab fa-github"></i>
                                </a>
                            </h3>
                        </div>

                ) : (
                    <Typography>Repo not found.</Typography> // improve later: 404 page
                )
            ) : (
                <Typography>Loading...</Typography> // improve later: better UI/UX
            )}
                        <Breadcrumbs items={breadcrumbItems} />
                    </div>
                </div>
            </section>
            <div className="border-bottom mb-3"></div>
            <section className="content">
                <div className="row">
                    <TestingStats repo_handle={user+'/'+repo_name}/>
                </div>

                <div className="row">
                    <StatusCheckRuns repo_handle={user+'/'+repo_name} />
                </div>

                <div className="row">
                    <PullRequestStats repo_handle={user+'/'+repo_name} />
                </div>
                <div className="border-bottom mb-3"></div>
                <div className="row">
                    <GuidelinesStats repo_handle={user+'/'+repo_name} />
                </div>
            <CodecovCard
                repo_handle={user+'/'+repo_name}
            />
            <CoverallsCard
                repo_handle={user+'/'+repo_name}
            />
            </section>
        </div>
    );
}

export default Repository;
