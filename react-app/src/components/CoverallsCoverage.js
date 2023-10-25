import React, {useEffect, useState} from 'react';
import InfoBox from "./InfoBox";
import axios from "axios";

function CoverallsCoverage({ repo_handle }){
    const [coverageData, setCoverageData] = useState(null);
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
    return(
        <>
        {coverageData ? (
                coverageData[0] !== 'NOT FOUND' ? (
                    <InfoBox colSize="3" color="white" iconClass="fa-code" text="Code Coverage (Coveralls)"
                             number={parseFloat(coverageData[coverageData.length - 1]['covered_percent'].toFixed(2))} />
                ) : (
                    <InfoBox colSize="3" color="white" iconClass="fa-code" text="Code Coverage (Coveralls)" number="Not Found"/>
                )
            ) : (
            <InfoBox colSize="3" color="white" iconClass="fa-code" text="Code Coverage (Coveralls)" number="Loading"/>
            )}
        </>
        //

        // <div className={`col-lg-${3} info-box-container`}>
        //     <div className={`info-box bg-gradient-white`}>
        // <span className="info-box-icon">
        //     <i className="fas fa-code"></i>
        // </span>
        //         <div className="info-box-content">
        //             <span className="info-box-text">Code Coverage</span>
        //                 <span className="info-box-number">{parseFloat(coverageData[coverageData.length - 1]['covered_percent'].toFixed(2))}</span>
        //                 {/*<img src={coverageData[coverageData.length - 1]['badge_url']} alt="Badge" />*/}
        //             {/*<ul>*/}
        //             {/*    <li><strong>Branch:</strong> {coverageData[coverageData.length - 1]['branch']}</li>*/}
        //             {/*    <li><strong>Commit SHA:</strong> {coverageData[coverageData.length - 1]['commit_sha']}</li>*/}
        //             {/*    <li><strong>Covered Percent:</strong> {coverageData[coverageData.length - 1]['covered_percent']}%</li>*/}
        //             {/*    <li><strong>Created At:</strong> {coverageData[coverageData.length - 1]['created_at']}</li>*/}
        //             {/*</ul>*/}
        //         </div>
        //     </div>
        // </div>
    );
}

export default CoverallsCoverage;
