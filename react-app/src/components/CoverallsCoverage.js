import React, {useEffect, useState} from 'react';
import InfoBox from "./InfoBox";
import axios from "axios";

function calcStats(data){
    let coverageChange = data[0]['covered_percent'] - data[data.length - 1]['covered_percent'];
    coverageChange = coverageChange.toFixed(2);
    return {coverageChange};
}
function CoverallsCoverage({ repo_handle }){
    const [coverageData, setCoverageData] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        async function fetchCoverallsDetails() {
            try {
                const response = await axios.get(`/api/coveralls/${repo_handle}`);
                return response.data;
            } catch (error) {
                console.error('Error fetching repo details:', error);
                return null;
            }
        }

        fetchCoverallsDetails()
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

    useEffect(() => {
        if (coverageData) {
            const calculatedStats = calcStats(coverageData);
            setStats(calculatedStats);
        }
    }, [coverageData]);

    function formatReadableDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }

    return(
        <>
        {coverageData && stats ? (
                coverageData[0] !== 'NOT FOUND' ? (
                    <>
                    <InfoBox colSize="3" color="white" iconClass="fa-code" text="Code Coverage (Coveralls)"
                             number={parseFloat(coverageData[0]['covered_percent'].toFixed(1))} />
                    <div className={`col-lg-4 info-box-container`}>
                        <div className="info-box">
                            <span className="info-box-icon bg-info"><i className="fas fa-code"></i></span>
                            <div className="info-box-content">
                                <span className="info-box-text">
                                    Coverage change from {formatReadableDate(coverageData[coverageData.length - 1]['created_at'])} to {formatReadableDate(coverageData[0]['created_at'])}
                                </span>
                                <span className="info-box-number">Branch: {coverageData[0]['branch'] ? coverageData[0]['branch'] : 'N/A'}</span>
                                <div className="progress">
                                    <div className="progress-bar bg-info" style={{ width: `${stats.coverageChange}%` }}></div>
                                </div>
                                <span className="progress-description">{stats.coverageChange}% change</span>
                            </div>
                        </div>
                    </div>
                    </>
                ) : (
                    <InfoBox colSize="3" color="white" iconClass="fa-code" text="Code Coverage (Coveralls)" number="Not Found"/>
                )
            ) : (
            <InfoBox colSize="3" color="white" iconClass="fa-code" text="Code Coverage (Coveralls)" number="Loading"/>
            )}

        </>
    );
}

export default CoverallsCoverage;
