import React, {useEffect, useState} from 'react';
import InfoBox from "./InfoBox";
import axios from "axios";
import Typography from "@mui/material/Typography";

function CodecovCoverage({ repo_handle }){
    const [coverageData, setCoverageData] = useState(null);
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
                if(!data){
                    setCoverageData(null);
                }
                setCoverageData(data);
            })
            .catch(error => {
                console.error(error);
                setCoverageData([]); // set empty state on error
            });

    }, [repo_handle]);
    return(
        <>
            {coverageData ? (
                coverageData[0] !== 'NOT FOUND' ? (
                    <InfoBox colSize="3" color="white" iconClass="fa-code" text="Code Coverage (Codecov)"
                             number={coverageData[coverageData.length - 1]['avg'].toFixed(2)} />
                ) : (
                    <InfoBox colSize="3" color="white" iconClass="fa-code" text="Code Coverage (Codecov)" number="Not Found"/>
                )
            ) : (
                <InfoBox colSize="3" color="white" iconClass="fa-code" text="Code Coverage (Codecov)" number="Loading..."/>
            )}
        </>
    );
}

export default CodecovCoverage;
