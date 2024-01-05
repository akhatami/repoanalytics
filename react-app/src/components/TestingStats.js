import React, {useEffect, useState} from 'react';
import CoverallsCoverage from "./CoverallsCoverage";
import CodecovCoverage from "./CodecovCoverage";
import axios from "axios";
import InfoBox from "./InfoBox";
function TestingStats({ repo_handle }) {
    const [repo, setRepo] = useState(null);

    useEffect(() => {
        async function fetchRepoDetails() {
            try {
                const response = await axios.get(`/api/repo/${repo_handle}`);
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

    }, [repo_handle]);
    return(
        <>
            <div className="row-sm-12">
                <h4 className="mb-3">Project Testing Stats</h4>
            </div>
            {repo && repo.has_coveralls === 1 ? (
                <CoverallsCoverage repo_handle={repo_handle} />
            ): ''}

            {repo && repo.has_codecov === 1 ? (
                <CodecovCoverage repo_handle={repo_handle} />
            ) : ''}

            {repo && repo.has_coveralls !== 1 && repo.has_codecov !== 1 ? (
                <InfoBox colSize="3" color="warning" iconClass="fa-code" text="No Coverage Found"/>
            ) : ''}
            <InfoBox colSize="3" color="green" iconClass="fa-chart-bar" text="More Stats" path={`/${repo_handle}/testing`} />
        </>
    );
}
export default TestingStats;
