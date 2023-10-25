import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import CodecovCard from "./CodecovCard";
import CoverallsCard from "./CoverallsCard";
import PullRequestCard from "./PullRequestCard";
import Breadcrumbs from "./Breadcrumbs";
import InfoBox from "./InfoBox";
import CoverallsCoverage from "./CoverallsCoverage";
import CodecovCoverage from "./CodecovCoverage";

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

        // console.log(repo['has_coveralls']);

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
                            <h3 className="mb-0">{user}/{repo_name}</h3>
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
            <section className="content">
            <div className="row">
                <CoverallsCoverage repo_handle={user+'/'+repo_name} />
                <CodecovCoverage repo_handle={user+'/'+repo_name} />
                <InfoBox colSize="3" color="white" iconClass="fa-code-branch" text="PR Statuses" number={1} />
                <InfoBox colSize="3" color="white" iconClass="fa-eye" text="PR avg time" number={"X"} />
                <InfoBox colSize="3" color="white" iconClass="fa-user" text="Guidelines" number={"X"} />
            </div>

            <PullRequestCard
                repo_handle={user+'/'+repo_name}
            />
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
